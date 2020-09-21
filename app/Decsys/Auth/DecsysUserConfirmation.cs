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
            var confirmed = user.EmailConfirmed;

            if (_approvalRequired)
                confirmed = confirmed && user.ApprovalDate.HasValue;

            return Task.FromResult(confirmed);
        }
    }
}
