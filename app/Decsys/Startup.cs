using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using AspNetCore.Identity.Mongo.Model;
using AspNetCore.Identity.Mongo.Stores;
using AutoMapper;
using ClacksMiddleware.Extensions;
using Decsys.Auth;
using Decsys.Config;
using Decsys.Constants;
using Decsys.Data;
using Decsys.Data.Entities;
using Decsys.Repositories.Contracts;
using Decsys.Repositories.LiteDb;
using Decsys.Services;
using Decsys.Services.Contracts;
using Decsys.Services.EmailSender;
using Decsys.Services.EmailServices;
using LiteDB;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using UoN.AspNetCore.RazorViewRenderer;
using UoN.AspNetCore.VersionMiddleware;
using UoN.VersionInformation;
using UoN.VersionInformation.DependencyInjection;
using UoN.VersionInformation.Providers;
using static IdentityServer4.IdentityServerConstants;

namespace Decsys
{
    public class Startup
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _config;

        private readonly Dictionary<string, string> _localPaths;

        private Dictionary<string, string> PrepLocalDataPaths(string localDataPath)
        {
            // relative to contentRootPath if not absolute
            localDataPath = Path.IsPathRooted(localDataPath)
                ? localDataPath
                : Path.Combine(_env.ContentRootPath, localDataPath);

            // map our defined paths to absolute paths dictionary
            var localPaths = new List<(string key, string path)>
            {
                ("SurveyImages", "survey-images"),
                ("Databases", "db")
            }
            .ToDictionary(
                subDir => subDir.key,
                subDir => Path.Combine(localDataPath, subDir.path));

            // ensure they all exist
            localPaths.Values.ToList().ForEach(p => Directory.CreateDirectory(p));

            // return the dictionary of absolute paths
            return localPaths;
        }

        public Startup(IWebHostEnvironment env, IConfiguration config)
        {
            _env = env;
            _config = config;

            if (_config.GetValue<bool>("WorkshopMode"))
                _localPaths = PrepLocalDataPaths(_config["Paths:LocalData"]);
            else _localPaths = new();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // configure app mode
            AppMode mode = new() { IsWorkshop = _config.GetValue<bool>("WorkshopMode") };
            services.Configure<AppMode>(c => c.IsWorkshop = mode.IsWorkshop);

            var hostedDbSettings = _config.GetSection("Hosted").Get<HostedDbSettings>();
            services.Configure<HostedDbSettings>(_config.GetSection("Hosted"));


            // configure version mappings
            foreach (var v in Versions.All)
            {
                services.Configure<ComponentTypeMap>(v,
                    c => _config
                        .GetSection($"ComponentTypeMaps:{v}")
                        .Bind(c.Types));
            }

            var useSendGrid = _config["Hosted:OutboundEmail:Provider"]
                .Equals("sendgrid", StringComparison.InvariantCultureIgnoreCase);
            if (useSendGrid) services.Configure<SendGridOptions>(_config.GetSection("Hosted:OutboundEmail"));
            else services.Configure<LocalDiskEmailOptions>(_config.GetSection("Hosted:OutboundEmail"));

            if (mode.IsHosted)
            {
                var mongoClient = new MongoClient(_config.GetConnectionString("mongo"));
                services.AddSingleton<IMongoClient, MongoClient>(_ => mongoClient);

                // Identity
                services.AddSingleton<IUserConfirmation<DecsysUser>, DecsysUserConfirmation>();
                services.AddIdentityCore<DecsysUser>(opts =>
                        opts.SignIn.RequireConfirmedAccount = true)
                    .AddRoles<MongoRole>()
                    .AddRoleStore<RoleStore<MongoRole>>()
                    .AddUserStore<UserStore<DecsysUser, MongoRole>>()
                    .AddRoleManager<RoleManager<MongoRole>>()
                    .AddUserManager<UserManager<DecsysUser>>()
                    .AddSignInManager<SignInManager<DecsysUser>>()
                    .AddDefaultTokenProviders();

                // Additional Mongo Identity Store setup
                var roleCollection = mongoClient
                    .GetDatabase(hostedDbSettings.DatabaseName)
                    .GetCollection<MongoRole>(Collections.Roles);
                var userCollection = mongoClient
                    .GetDatabase(hostedDbSettings.DatabaseName)
                    .GetCollection<DecsysUser>(Collections.Users);

                services.AddSingleton(_ => roleCollection);
                services.AddSingleton(_ => userCollection);

                services.AddTransient<IRoleStore<MongoRole>>(_ => new RoleStore<MongoRole>(roleCollection));
                services.AddTransient<IUserStore<DecsysUser>>(x =>
                    new UserStore<DecsysUser, MongoRole>(
                        userCollection,
                        new RoleStore<MongoRole>(roleCollection),
                        x.GetService<ILookupNormalizer>()));

                // Identity Server
                var idsBuilder = services.AddIdentityServer(opts => opts.UserInteraction.ErrorUrl = "/error")
                    .AddInMemoryIdentityResources(IdentityServerConfig.IdentityResources)
                    .AddInMemoryApiScopes(IdentityServerConfig.ApiScopes)
                    .AddInMemoryClients(IdentityServerConfig.Clients(_config["Hosted:Origin"]))
                    .AddPersistedGrantStore<MongoPersistedGrantStore>()
                    .AddAspNetIdentity<DecsysUser>();

                // Sort out Signing Keys
                if (_env.IsDevelopment())
                    idsBuilder.AddDeveloperSigningCredential();
                else idsBuilder.AddSigningCredential(RsaKeyService.GetRsaKey(_config), RsaSigningAlgorithm.RS256);

                services.AddAuthentication()
                    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, opts =>
                    {
                        opts.Authority = _config["Hosted:Origin"];
                        opts.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateAudience = false
                        };
                    })
                    .AddIdentityCookies(opts =>
                        opts.ApplicationCookie.Configure(
                            config => config.LoginPath = "/auth/login"));
            }
            if (mode.IsWorkshop)
            {
                services.AddSingleton(_ => new LiteDbFactory(_localPaths["Databases"]));
            }

            services.AddResponseCompression();

            services.AddAuthorization(opts => opts.AddPolicy(
                nameof(AuthPolicies.IsSurveyAdmin),
                AuthPolicies.IsSurveyAdmin(mode)));

            services.AddControllersWithViews()
                // we used JSON.NET back in .NET Core 2.x
                // for ViewModel Property shenanigans so component params can be dynamic
                // it doesn't really make sense to change this
                // (if System.Text.Json even does what we need)
                .AddNewtonsoftJson();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(o => o.RootPath = "ClientApp");

            services.AddAutoMapper(typeof(Startup));

            services.AddVersionInformation(opts =>
                opts.KeyHandlers.Add("file",
                    new KeyValueFileProvider
                    {
                        FileOptional = true
                    }));

            if (mode.IsHosted)
            {
                services.AddTransient<
                    ISurveyRepository,
                    Repositories.Mongo.SurveyRepository>();
                services.AddTransient<
                    IPageRepository,
                    Repositories.Mongo.PageRepository>();
                services.AddTransient<
                    IComponentRepository,
                    Repositories.Mongo.ComponentRepository>();
                services.AddTransient<
                    ISurveyInstanceRepository,
                    Repositories.Mongo.SurveyInstanceRepository>();
                services.AddTransient<
                    IParticipantEventRepository,
                    Repositories.Mongo.ParticipantEventRepository>();

                services.AddTransient<IImageService, MongoImageService>();

                // Email related
                services.TryAddSingleton<IActionContextAccessor, ActionContextAccessor>();
                services.AddTransient<TokenIssuingService>();
                services.AddTransient<IRazorViewRenderer, RazorViewRenderer>();
                services.AddTransient<RazorViewService>();
                services.AddTransient<AccountEmailService>();
                if (useSendGrid) services.AddTransient<IEmailSender, SendGridEmailSender>();
                else services.AddTransient<IEmailSender, LocalDiskEmailSender>();
            }
            if (mode.IsWorkshop)
            {
                services.AddTransient<ISurveyRepository, LiteDbSurveyRepository>();
                services.AddTransient<IPageRepository, LiteDbPageRepository>();
                services.AddTransient<IComponentRepository, LiteDbComponentRepository>();
                services.AddTransient<ISurveyInstanceRepository, LiteDbSurveyInstanceRepository>();
                services.AddTransient<IParticipantEventRepository, LiteDbParticipantEventRepository>();

                services.AddTransient<IImageService>(svc =>
                    new LocalFileImageService(
                        _localPaths["SurveyImages"],
                        svc.GetRequiredService<IComponentRepository>()));
            }

            services.AddTransient<SurveyService>();
            services.AddTransient<PageService>();
            services.AddTransient<ComponentService>();
            services.AddTransient<SurveyInstanceService>();
            services.AddTransient<ExportService>();
            services.AddTransient<ParticipantEventService>();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "DECSYS API", Version = "v1" });
                c.EnableAnnotations();
            }).AddSwaggerGenNewtonsoftSupport();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, VersionInformationService version, IOptions<AppMode> modeAccessor)
        {
            var mode = modeAccessor.Value;

            app.UseResponseCompression();

            app.GnuTerryPratchett();

            if (_env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                // app.UseHsts(); TODO: Add HSTS when ready, or make it configurable. Only applies to hosted versions anyway.
            }

            app.UseHttpsRedirection();

            app.UseVersion(GetVersionInfo(version));

            app.UseStaticFiles();

            // components' static files
            // serve static files but only those we can validly map
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(_env.ContentRootPath, _config["Paths:Components:Root"])),
                RequestPath = "/static/components",
                ContentTypeProvider = new FileExtensionContentTypeProvider(GetValidMappings())
            });

            // Survey Images
            if (mode.IsWorkshop)
            {
                // simply serve static files from disk
                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(_localPaths["SurveyImages"]),
                    RequestPath = "/surveys/images"
                });
            } // else we map an endpoint later


            app.UseSpaStaticFiles();

            app.UseRewriter(new RewriteOptions()
                .AddRedirect("docs", "docs/index.html"));

            app.UseSwagger();

            app.UseSwaggerUI(c =>
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

            app.UseEndpoints(e =>
            {
                e.MapControllers()
                    .RequireAuthorization(nameof(AuthPolicies.IsSurveyAdmin));

                // TODO: move this to formal middleware
                e.MapGet("/surveys/images/{surveyId:int}/{filename}", async context =>
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

                if (_env.IsDevelopment())
                    spa.UseReactDevelopmentServer(npmScript: "start");
            });
        }

        private static object GetVersionInfo(IVersionInformationService version)
        {
            // start with the keys from the file, cast back to the original dictionary
            var versionInfo = (Dictionary<string, string>)
                (version.ByKey("file", "version.txt")
                    ?? new Dictionary<string, string>());

            // Add further keys, so everything's at the top level
            versionInfo["API App"] = (string)version.EntryAssembly();

            return versionInfo;
        }

        private static IDictionary<string, string> GetValidMappings()
        {
            // in future we may want to make this a configurable list.
            var validExtensions = new List<string> { ".js", ".map" };

            // steal the mappings we want from a default FileExtensionContentTypeProvider
            return new FileExtensionContentTypeProvider().Mappings
                .Where(x => validExtensions.Contains(x.Key))
                .ToDictionary(x => x.Key, x => x.Value,
                    StringComparer.OrdinalIgnoreCase);
        }
    }
}
