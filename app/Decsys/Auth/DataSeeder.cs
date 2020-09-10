using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Decsys.Auth
{
    public static class DataSeeder
    {
        const string _defaultAdminUsername = "admin";
        const string _adminEmail = "admin@localhost";

        public static async Task Seed(
            UserManager<IdentityUser> users,
            IPasswordHasher<IdentityUser> passwords,
            IConfiguration config)
        {
            // Seed an initial super user to use for setup

            
            var configuredUsername = config["Hosted:AdminUsername"];
            var username = string.IsNullOrWhiteSpace(configuredUsername)
                ? _defaultAdminUsername
                : configuredUsername;

            // Prefix the username to show it's not an email
            username = $"@{username}";
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
                    Email = _adminEmail,
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
