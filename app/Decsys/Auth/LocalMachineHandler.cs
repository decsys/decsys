using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Decsys.Auth
{
    /// <summary>
    /// Extremely naive handler for LocalMachineRequirement.
    /// Requires use with MVC.
    /// </summary>
    public class LocalMachineHandler : AuthorizationHandler<LocalMachineRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, LocalMachineRequirement requirement)
        {
            if (context.Resource is AuthorizationFilterContext mvcContext)
            {
                if (mvcContext.HttpContext.Request.Host.Host == "localhost")
                    context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
