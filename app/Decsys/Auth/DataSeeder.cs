using System;
using System.Security.Claims;
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
            var username = "admin@localhost";
            if (await users.FindByNameAsync(username) is null)
            {
                // check an actual password has been configured
                var pwd = config["Hosted:AdminPassword"];
                if (string.IsNullOrEmpty(pwd))
                {
                    throw new ApplicationException(@"
A non-empty password must be configured for seeding the initial Admin User.
Please set Hosted:AdminPassword in a settings or user secrets file,
or the environment variable DOTNET_Hosted_AdminPassword");
                }

                var user = new IdentityUser
                {
                    UserName = username,
                    Email = username,
                    EmailConfirmed = true
                };

                user.PasswordHash = passwords.HashPassword(user, pwd);

                await users.CreateAsync(user);
                await users.AddClaimAsync(user,
                    new Claim(ClaimTypes.Role, "survey.admin"));
            }
        }
    }
}
