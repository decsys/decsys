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
            => new AuthorizationPolicyBuilder()
                .AddAuthenticationSchemes("Bearer")
                // multiple optional fulfillments,
                // possibly under different conditions
                // e.g. localhost only for Workshop mode?
                .RequireAssertion(
                    // TODO: if this gets more complex,
                    // switch to a requirement with multiple handlers
                    context =>
                        // localhost access == admin (TODO: Workshop only?)
                        (mode.IsWorkshop &&
                            ((DefaultHttpContext?)context.Resource)?
                                .Request.Host.Host == "localhost")
                        ||
                        // having the claim obviously fulfills the role
                        context.User.HasClaim(ClaimTypes.Role, "survey.admin"))
                .Build();
    }
}
