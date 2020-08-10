using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Decsys.Auth
{
    public static class DataSeeder
    {
        public static async Task Seed(
            UserManager<IdentityUser> users,
            IPasswordHasher<IdentityUser> passwords,
            IConfiguration config)
        {
            // Seed an initial super user to use for setup
            if (await users.FindByNameAsync("superadmin@localhost") is null)
            {
                // check an actual password has been configured
                var pwd = config["SuperAdminSeedPassword"];
                if (string.IsNullOrEmpty(pwd))
                {
                    throw new ApplicationException(@"
A non-empty password must be configured for seeding the inital SuperAdmin User.
Please set SuperAdminSeedPassword in a user secrets file,
or the environment variable DOTNET_SuperAdminSeedPassword");
                }

                var user = new IdentityUser
                {
                    UserName = "superadmin@localhost",
                    Email = "superadmin@localhost",
                    EmailConfirmed = true
                };

                user.PasswordHash = passwords.HashPassword(user, pwd);

                await users.CreateAsync(user);
            }
        }
    }
}
