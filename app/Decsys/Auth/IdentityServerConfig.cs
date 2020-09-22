using System.Collections.Generic;
using System.Security.Claims;
using IdentityServer4;
using IdentityServer4.Models;

namespace Decsys.Auth
{
    public static class IdentityServerConfig
    {
        // Identity Scopes provided by the DECSYS Backend IdP
        // Claims here end up in the user profile granted to the client
        // assuming they request (and are allowed) the relevant scopes
        public static IEnumerable<IdentityResource> IdentityResources
            => new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResource("roles", new [] { ClaimTypes.Role })
                // Add other / custom IdentityResources here
            };

        // Scopes of access to the DECSYS Backend API
        // Claims here end up in the access_token granted to the client
        // assuming they request (and are allowed) the relevant scopes
        public static IEnumerable<ApiScope> ApiScopes =>
            new List<ApiScope>
            {
                new ApiScope("survey.admin", "Survey Administration",
                    new [] { ClaimTypes.Role, ClaimTypes.Email })
            };

        // Pre-configured clients - i.e. the DECSYS frontend only
        public static IEnumerable<Client> Clients(string origin) =>
            new List<Client>
            {
                new Client
                {
                    ClientId = "decsys-client-app",
                    AllowedGrantTypes = GrantTypes.Code,
                    RequireClientSecret = false,
                    RequireConsent = false,
                    RequirePkce = true,
                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "roles",
                        "survey.admin"
                    },
                    RedirectUris = { $"{origin}/auth/oidc-complete-signin" },
                    PostLogoutRedirectUris = { origin },
                }
            };
    }
}
