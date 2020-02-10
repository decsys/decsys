using AutoMapper;
using ClacksMiddleware.Extensions;
using Decsys.Auth;
using Decsys.Services;
using LiteDB;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UoN.AspNetCore.VersionMiddleware;
using UoN.VersionInformation;
using UoN.VersionInformation.DependencyInjection;
using UoN.VersionInformation.Providers;

#pragma warning disable 1591
namespace Decsys
{
    public class Startup
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _config;

        public Startup(IWebHostEnvironment env, IConfiguration config)
        {
            _env = env;
            _config = config;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddResponseCompression();

            services.AddAuthorization(opts => opts.AddPolicy(
                nameof(AuthPolicies.LocalHost),
                AuthPolicies.LocalHost()));

            services.AddSingleton<IAuthorizationHandler, LocalMachineHandler>();

            services.AddControllers();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(o => o.RootPath = "ClientApp/build");

            services.AddSingleton(_ => new LiteDatabase(
                _config.GetConnectionString("DocumentStore")));

            services.AddAutoMapper(typeof(Startup));

            services.AddVersionInformation(opts =>
                opts.KeyHandlers.Add("file",
                    new KeyValueFileProvider
                    {
                        FileOptional = true
                    }));

            services.AddTransient<SurveyService>();
            services.AddTransient<PageService>();
            services.AddTransient<ComponentService>();
            services.AddTransient<SurveyInstanceService>();
            services.AddTransient<ExportService>();
            services.AddTransient<ParticipantEventService>();
            services.AddTransient(svc => new ImageService(
                Path.Combine(
                    _env.ContentRootPath,
                    "SurveyImages"),
                svc.GetRequiredService<LiteDatabase>()));

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "DECSYS API", Version = "v1" });
                c.EnableAnnotations();
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, VersionInformationService version)
        {
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

            app.UseDefaultFiles().UseStaticFiles();

            // components' static files
            // serve static files but only those we can validly map
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(_env.ContentRootPath, _config["Paths:Components:Root"])),
                RequestPath = "/static/components",
                ContentTypeProvider = new FileExtensionContentTypeProvider(GetValidMappings())
            });

            // Survey Images folder
            var imagePath = Path.Combine(_env.ContentRootPath, "SurveyImages");
            Directory.CreateDirectory(imagePath);
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(imagePath),
                RequestPath = "/surveys/images"
            });

            app.UseSpaStaticFiles();

            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.RoutePrefix = "api";
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "DECSYS API v1");
            });

            app.UseRouting();

            app.UseEndpoints(e =>
            {
                e.MapControllers();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (_env.IsDevelopment())
                    spa.UseReactDevelopmentServer(npmScript: "start");
            });
        }

        private object GetVersionInfo(IVersionInformationService version)
        {
            // start with the keys from the file, cast back to the original dictionary
            var versionInfo = (Dictionary<string, string>)
                (version.ByKey("file", "version.txt")
                    ?? new Dictionary<string, string>());

            // Add further keys, so everything's at the top level
            versionInfo["API App"] = (string)version.EntryAssembly();

            return versionInfo;
        }

        private IDictionary<string, string> GetValidMappings()
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
#pragma warning restore 1591
