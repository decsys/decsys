using System;
using System.IO;
using System.Threading.Tasks;
using AspNetCore.Identity.Mongo.Model;
using Decsys.Config;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;

namespace Decsys
{
    public static class Program
    {
        public static async Task Main(string[] args)
        {
            // Build and Configure the host
            var host = CreateHostBuilder(args).Build();

            // Any initialisation post configuration but before running the host
            using (var serviceScope = host.Services?
                .GetService<IServiceScopeFactory>()?
                .CreateScope())
            {
                if (serviceScope is null)
                    throw new InvalidOperationException("Service Configuration failure.");

                await Init(serviceScope.ServiceProvider);
            }

            // Run the host
            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration((context, b) =>
                b.AddJsonFile(
                    Path.Combine(
                        context.HostingEnvironment.ContentRootPath,
                        "settings/component-type-maps.json"),
                    optional: false))
            .ConfigureWebHostDefaults(b =>
                b.UseStartup<Startup>());

        /// <summary>
        /// App Initialisation Tasks.
        /// Runs after `Startup.ConfigureServices()` but before the Host is run.
        /// </summary>
        /// <param name="services">The service provider configured by ConfigureServices()</param>
        public static async Task Init(IServiceProvider services)
        {
            var mode = services.GetRequiredService<IOptions<AppMode>>().Value;
            if (mode.IsHosted)
            {
                // Seed the SuperAdmin user according to configuration
                await Auth.DataSeeder.Seed(
                    services.GetRequiredService<UserManager<MongoUser>>(),
                    services.GetRequiredService<IPasswordHasher<MongoUser>>(),
                    services.GetRequiredService<IConfiguration>());
            }
        }
    }
}
