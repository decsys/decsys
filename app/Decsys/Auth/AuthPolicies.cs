using Microsoft.AspNetCore.Authorization;

namespace Decsys.Auth
{
    /// <summary>
    /// Contains static helpers to build common Authorisation Policies
    /// </summary>
    public static class AuthPolicies
    {
        public static AuthorizationPolicy LocalHost()
            => new AuthorizationPolicyBuilder()
                .AddRequirements(new LocalMachineRequirement())
                .Build();
    }
}
