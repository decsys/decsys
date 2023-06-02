using Decsys.Auth;
using Decsys.Config;
using Decsys.Data.Entities;
using Microsoft.AspNetCore.Identity;

namespace Decsys.Startup.Web;

public static class WebInitialisation
{
    /// <summary>
    /// Initialisation before the app runs.
    /// </summary>
    /// <param name="app">The web application to initialise.</param>
    /// <param name="mode">The mode of the app to initialise.</param>
    /// <exception cref="InvalidOperationException"></exception>
    public static async Task Initialise(this WebApplication app, AppMode mode)
    {
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
    }
    
}
