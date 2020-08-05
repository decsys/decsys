using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace Decsys
{
    public static class Program
    {
        public static void Main(string[] args)
            => CreateHostBuilder(args).Build().Run();

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
    }
}
