using System.Collections.Generic;
using AutoMapper.Configuration;
using IdentityServer4.Models;

namespace Decsys.Auth
{
    public static class IdentityServerConfig
    {
        public static IEnumerable<ApiScope> ApiScopes =>
            new List<ApiScope>
            {
                new ApiScope("backend-app", "DECSYS Backend API")
            };

        public static IEnumerable<Client> Clients(string origin) =>
            new List<Client>
            {
                new Client
                {
                    ClientId = "client-app",
                    AllowedGrantTypes = GrantTypes.Code,
                    RequireClientSecret = false,
                    RequireConsent = false,
                    RequirePkce = true,
                    AllowedScopes = { "backend-app" },
                    RedirectUris = { $"{origin}/auth/signin-oidc" },
                    PostLogoutRedirectUris = { $"{origin}/auth/signout-callback-oidc" },
                }
            };
    }
}
