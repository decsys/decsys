using System.Security.Claims;
using Decsys.Config;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace Decsys.Auth
{
    /// <summary>
    /// Contains static helpers to build common Authorisation Policies
    /// </summary>
    public static class AuthPolicies
    {
        public static AuthorizationPolicy IsSurveyAdmin(AppMode mode)
        {
            var b = new AuthorizationPolicyBuilder();

            if (mode.IsHosted)
                b.AddAuthenticationSchemes("Bearer");

            b.RequireAssertion(context =>
                {
                    // multiple optional fulfillments,
                    // possibly under different conditions
                    // e.g. localhost only for Workshop mode?
                    if (mode.IsWorkshop)
                    {
                        // localhost access == admin
                        return ((DefaultHttpContext?)context.Resource)?
                            .Request.Host.Host == "localhost";
                    }

                    // having the claim obviously fulfills the policy
                    return context.User.HasClaim(ClaimTypes.Role, "survey.admin");
                });

            return b.Build();
        }
    }
}
