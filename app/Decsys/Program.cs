
using ClacksMiddleware.Extensions;

using Decsys;
using Decsys.Auth;
using Decsys.Config;
using Decsys.Data.Entities;
using Decsys.Services;
using Decsys.Services.Contracts;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.OpenApi.Models;

using MongoDB.Bson.Serialization;
using MongoDB.Driver;

#region Host Creation

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile(
    Path.Combine(
        builder.Environment.ContentRootPath,
        "settings/component-type-maps.json"),
    optional: false);

#endregion

#region Configure Services

AppMode mode = new() { IsWorkshop = builder.Configuration.GetValue<bool>("WorkshopMode") };

// We have to do some hosted services first (if in Hosted mode)
// because some extensions (e.g. UseAuthorization) require other services to already be added (e.g. UseAuthentication)
if (mode.IsHosted)
{
    var hostedDbSettings = builder.Configuration.GetSection("Hosted").Get<HostedDbSettings>();

    var mongoClient = new MongoClient(builder.Configuration.GetConnectionString("mongo"));

    builder.Services
        .AddMongoDb(mongoClient)
        .AddAppIdentity(mongoClient, hostedDbSettings)
        .AddAppIdentityServer(builder.Configuration, builder.Environment)
        .AddAppAuthentication(builder.Configuration)
        .AddMongoDbRepositories()
        .AddTransient<IImageService, MongoImageService>()
        .AddEmailSender(builder.Configuration);
}

builder.Services
    .Configure<AppMode>(c => c.IsWorkshop = mode.IsWorkshop)
    .Configure<HostedDbSettings>(builder.Configuration.GetSection("Hosted"))
    .ConfigureVersions(builder.Configuration)

    .AddResponseCompression()

    .AddAppAuthorization(mode)

    .AddAutoMapper(typeof(Program))

    .AddAppServices()

    .AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "DECSYS API", Version = "v1" });
            c.EnableAnnotations();
        })
    .AddSwaggerGenNewtonsoftSupport()

    .AddAppMvcServices()
    .AddAppSpaServices()

    .AddAppVersionInformation();

if (mode.IsWorkshop)
{
    builder.Services
        .AddSingleton<ILocalPathsProvider, LocalPathsProvider>()
        .AddLiteDb()
        .AddTransient<IImageService, LocalFileImageService>();
}

#endregion

#region Configure Application Pipeline

var app = builder.Build();

app.UseResponseCompression();

app.GnuTerryPratchett();

if (!builder.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    if (mode.IsHosted) app.UseHsts();
}

app.UseHttpsRedirection();

app.UseAppVersion();

app.UseDefaultFiles();

app.UseAppStaticFiles(mode);

app.UseSwagger()
    .UseSwaggerUI(c =>
    {
        c.RoutePrefix = "api";
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "DECSYS API v1");
    });

app.UseRouting();

if (mode.IsHosted)
{
    app.UseIdentityServer();
    app.UseAuthentication();
}

app.UseAuthorization();

app.UseEndpoints(app =>
{
    app.MapControllers()
        .RequireAuthorization(nameof(AuthPolicies.IsSurveyAdmin));

    // TODO: move this to formal middleware
    app.MapGet("/surveys/images/{surveyId:int}/{filename}", async context =>
    {
        var surveyId = int.Parse(context.Request.RouteValues["surveyId"]?.ToString() ?? "0");
        var filename = context.Request.RouteValues["filename"]?.ToString();
        if (filename is null)
        {
            context.Response.StatusCode = 404;
            return;
        }
        var images = context.RequestServices.GetRequiredService<IImageService>();
        var bytes = await images.GetImage(surveyId, filename);

        if (new FileExtensionContentTypeProvider()
            .TryGetContentType(filename, out var contentType))
        {
            context.Response.ContentType = contentType;
        }

        await context.Response.Body.WriteAsync(bytes.AsMemory(0, bytes.Length));
    });
});

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "../client-app";
    spa.Options.PackageManagerCommand = "yarn";

    if (app.Environment.IsDevelopment())
        spa.UseReactDevelopmentServer(npmScript: "start");
});

#endregion

#region Initialisation (Pre Host Run)

if (mode.IsHosted)
{
    using var scope = app.Services.CreateScope();

    if (scope is null)
        throw new InvalidOperationException("Service Configuration failure.");

    // Seed the SuperAdmin user according to configuration
    await DataSeeder.Seed(
    scope.ServiceProvider.GetRequiredService<UserManager<DecsysUser>>(),
    scope.ServiceProvider.GetRequiredService<IPasswordHasher<DecsysUser>>(),
    scope.ServiceProvider.GetRequiredService<IConfiguration>());
}

#endregion

// Run Host
await app.RunAsync();
