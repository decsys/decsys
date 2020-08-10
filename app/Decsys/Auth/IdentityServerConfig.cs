using System.Collections.Generic;
using IdentityServer4;
using IdentityServer4.Models;

namespace Decsys.Auth
{
    public static class IdentityServerConfig
    {
        // Identity Scopes provided by the DECSYS Backend IdP
        public static IEnumerable<IdentityResource> IdentityResources
            => new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile()
                // Add other / custom IdentityResources here
                // e.g. new IdentityResource("my-resource", "My Resource", new Claim(CustomClaimTypes.MyResource, "value"))
            };

        // Scopes of access to the DECSYS Backend API
        public static IEnumerable<ApiScope> ApiScopes =>
            new List<ApiScope>
            {
                new ApiScope("survey.admin", "Survey Administration")
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
                        "survey.admin"
                    },
                    RedirectUris = { $"{origin}/auth/oidc-complete-signin" },
                    PostLogoutRedirectUris = { $"{origin}/auth/oidc-complete-signout" },
                }
            };
    }
}
