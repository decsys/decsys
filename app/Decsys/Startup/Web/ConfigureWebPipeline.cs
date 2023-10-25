using ClacksMiddleware.Extensions;
using Decsys.Auth;
using Decsys.Config;
using Decsys.Services.Contracts;
using Microsoft.AspNetCore.StaticFiles;
using UoN.AspNetCore.VersionMiddleware;

namespace Decsys.Startup.Web;

public static class ConfigureWebPipeline
{
    public static WebApplication UseWebPipeline(this WebApplication app, AppMode mode)
    {
        app.UseResponseCompression()
            
            // Enable reading request streams manually when needed
            // https://markb.uk/asp-net-core-read-raw-request-body-as-string.html
            .Use(next => context => {
                context.Request.EnableBuffering();
                return next(context);
            });
        
        app.GnuTerryPratchett();
        
        if (app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler("/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            if (mode.IsHosted) app.UseHsts();
        }
        
        app.UseHttpsRedirection();
        
        app.UseVersion();
        
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
        
        app.MapRazorPages();
        
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
        
        app.MapFallbackToFile("index.html").AllowAnonymous();
        
        return app;
    }
    
}
