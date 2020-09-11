using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AspNetCore.Identity.Mongo.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Decsys.Auth
{
    public static class DataSeeder
    {
        const string _defaultAdminUsername = "admin";
        const string _adminEmail = "admin@localhost";

        public static async Task Seed(
            UserManager<MongoUser> users,
            IPasswordHasher<MongoUser> passwords,
            IConfiguration config)
        {
            // Seed an initial super user to use for setup


            // prep username
            var configuredUsername = config["Hosted:AdminUsername"];
            var username = string.IsNullOrWhiteSpace(configuredUsername)
                ? _defaultAdminUsername
                : configuredUsername;
            username = $"@{username}"; // Prefix the username to show it's not an email


            // check an actual password has been configured
            var pwd = config["Hosted:AdminPassword"];
            if (string.IsNullOrEmpty(pwd))
            {
                throw new ApplicationException(@"
A non-empty password must be configured for seeding the initial Admin User.
Please set Hosted:AdminPassword in a settings or user secrets file,
or the environment variable DOTNET_Hosted_AdminPassword");
            }

            // Add the user if they don't exist, else update them,
            var superAdmin = await users.FindByEmailAsync(_adminEmail);
            if (superAdmin is null)
            {
                var user = new MongoUser
                {
                    UserName = username,
                    Email = _adminEmail,
                    EmailConfirmed = true
                };

                user.PasswordHash = passwords.HashPassword(user, pwd);

                await users.CreateAsync(user);
                await users.AddClaimAsync(user,
                    new Claim(ClaimTypes.Role, "survey.admin"));
            } else
            {
                // update username / password
                superAdmin.UserName = username;
                superAdmin.PasswordHash = passwords.HashPassword(superAdmin, pwd);
                await users.UpdateAsync(superAdmin);
            }
        }
    }
}
