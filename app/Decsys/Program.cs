using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace Decsys
{
    public static class Program
    {
        public static void Main(string[] args)
            => CreateHostBuilder(args).Build().Run();

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(b =>
                    b.UseStartup<Startup>());
    }
}
