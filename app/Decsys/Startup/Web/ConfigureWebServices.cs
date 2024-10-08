using Decsys.Config;
using Decsys.Services;
using Decsys.Services.Contracts;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using UoN.VersionInformation.DependencyInjection;

namespace Decsys.Startup.Web;

public static class ConfigureWebServices
{
    public static WebApplicationBuilder ConfigureServices(this WebApplicationBuilder builder, AppMode mode)
    {
        // We have to do some hosted services first (if in Hosted mode)
        // because some extensions (e.g. UseAuthorization) require other services to already be added (e.g. UseAuthentication)
        if (mode.IsHosted)
        {
            var hostedDbSettings = builder.Configuration.GetSection("Hosted").Get<HostedDbSettings>();

            var mongoClient = new MongoClient(builder.Configuration.GetConnectionString("mongo"));

            builder.Services
                .AddApplicationInsightsTelemetry()
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
            .AddAppServices(builder.Configuration) 
            .AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new() { Title = "DECSYS API", Version = "v1" });
                c.EnableAnnotations();

                var jwtSchemeId = "jwtbearer";
                var jwtScheme = new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    Reference = new()
                    {
                        Id = jwtSchemeId,
                        Type = ReferenceType.SecurityScheme,
                    }
                };
                c.AddSecurityDefinition(jwtSchemeId, jwtScheme);
                c.AddSecurityRequirement(new()
                {
                    [jwtScheme] = new List<string>()
                });
            })
            .AddSwaggerGenNewtonsoftSupport()
            .AddAppMvcServices()
            .AddVersionInformation();

        if (mode.IsWorkshop)
        {
            builder.Services
                .AddSingleton<ILocalPathsProvider, LocalPathsProvider>()
                .AddLiteDb()
                .AddTransient<IImageService, LocalFileImageService>();
        }

        return builder;
    }
}
