using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Decsys.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Decsys.Auth
{
    public static class DataSeeder
    {
        const string _defaultAdminUsername = "admin";

        public static async Task Seed(
            UserManager<DecsysUser> users,
            IPasswordHasher<DecsysUser> passwords,
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
            var superAdmin = await users.FindByEmailAsync(SuperUser.EmailAddress);
            if (superAdmin is null)
            {
                var user = new DecsysUser
                {
                    UserName = username,
                    Fullname = "Super Admin",
                    Email = SuperUser.EmailAddress,
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
