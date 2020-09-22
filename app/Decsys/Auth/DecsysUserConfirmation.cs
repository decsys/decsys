using System.Threading.Tasks;
using Decsys.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Decsys.Auth
{
    public class DecsysUserConfirmation : IUserConfirmation<DecsysUser>
    {
        private readonly bool _approvalRequired;

        public DecsysUserConfirmation(IConfiguration config)
        {
            _approvalRequired = config.GetValue<bool>("Hosted:AccountApprovalRequired");
        }

        public Task<bool> IsConfirmedAsync(UserManager<DecsysUser> manager, DecsysUser user)
        {
            // SuperUser is always confirmed.
            // This way we don't have to fix the seed data any time we change confirmation requirements
            if (user.IsSuperUser()) return Task.FromResult(true);

            // Other users' confirmation checks follow:

            var confirmed = user.EmailConfirmed;

            if (_approvalRequired)
                confirmed = confirmed && user.ApprovalDate.HasValue;

            return Task.FromResult(confirmed);
        }
    }
}
