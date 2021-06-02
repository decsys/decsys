using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

using Decsys.Config;
using Decsys.Repositories.Contracts;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Decsys.Auth
{
    /// <summary>
    /// Contains static helpers to build common Authorisation Policies
    /// </summary>
    public static class AuthPolicies
    {
        public static AuthorizationPolicy IsAuthenticated
            => new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build();

        public static AuthorizationPolicy IsSurveyAdmin(AppMode mode)
        {
            var b = new AuthorizationPolicyBuilder();

            if (mode.IsHosted)
                b.AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme);

            b.RequireAssertion(context =>
                {
                    // multiple optional fulfillments,
                    // possibly under different conditions
                    // e.g. localhost only for Workshop mode?
                    if (mode.IsWorkshop)
                    {
                        // localhost access == admin
                        return (new[] { "localhost", "127.0.0.1" })
                            .Contains(((DefaultHttpContext?)context.Resource)?
                                .Request.Host.Host);
                    }

                    // having the claim obviously fulfills the policy
                    return context.User.HasClaim(ClaimTypes.Role, "survey.admin");
                });

            return b.Build();
        }

        public static AuthorizationPolicy CanManageSurvey(AppMode mode)
            => new AuthorizationPolicyBuilder()
                .Combine(IsSurveyAdmin(mode))
                .RequireAssertion(context =>
                {
                    var httpContext = (DefaultHttpContext?)context.Resource;

                    var surveys = httpContext?.RequestServices.GetService<ISurveyRepository>();
                    if (surveys is null) return false;

                    if (!int.TryParse(
                        (string?)httpContext?.Request.RouteValues.GetValueOrDefault("id") ?? string.Empty,
                        out var surveyId))
                        return false;

                    var authenticatedUser = !mode.IsWorkshop &&
                        (context.User.Identity?.IsAuthenticated ?? false);

                    var result = surveys.TestSurveyAccess(surveyId,
                        !authenticatedUser ? string.Empty : context.User.GetUserId(),
                        context.User.IsSuperUser());

                    return result.IsAccessible();
                })
                .Build();
    }
}
