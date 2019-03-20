using LiteDB;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AutoMapper;
using Decsys.Services;
using Microsoft.Extensions.FileProviders;
using System.IO;
using Microsoft.AspNetCore.StaticFiles;
using System.Collections.Generic;
using System.Linq;
using System;
using Swashbuckle.AspNetCore.Swagger;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using ClacksMiddleware.Extensions;

#pragma warning disable 1591
namespace Decsys
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            
            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddSingleton(_ => new LiteDatabase(
                Configuration.GetConnectionString("DocumentStore")));

            services.AddAutoMapper();

            services.AddTransient<SurveyService>();
            services.AddTransient<PageService>();
            services.AddTransient<SurveyInstanceService>();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "DECSYS API", Version = "v1" });
                c.EnableAnnotations();
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.GnuTerryPratchett(); // KEep at the top to add to all requests

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                // app.UseHsts(); TODO: Add HSTS when ready, or make it configurable. Only applies to hosted versions anyway.
            }

            // We want to be able to turn this off for some local scenarios
            // where getting/signing/accepting certs isn't really feasible
            if(Configuration.GetValue<bool>("RequireHttps")) app.UseHttpsRedirection();



            app.UseStaticFiles();

            // components' static files
            // serve static files but only those we can validly map
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(env.ContentRootPath, Configuration["Paths:Components:Root"])),
                RequestPath = "/static/components",
                ContentTypeProvider = new FileExtensionContentTypeProvider(GetValidMappings())
            });

            app.UseSpaStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.RoutePrefix = "api";
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "DECSYS API v1");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }

        private IDictionary<string, string> GetValidMappings()
        {
            // in future we may want to make this a configurable list.
            var validExtensions = new List<string> { ".js" };

            // steal the mappings we want from a default FileExtensionContentTypeProvider
            return new FileExtensionContentTypeProvider().Mappings
                .Where(x => validExtensions.Contains(x.Key))
                .ToDictionary(x => x.Key, x => x.Value,
                    StringComparer.OrdinalIgnoreCase);
        }
    }
}
#pragma warning restore 1591