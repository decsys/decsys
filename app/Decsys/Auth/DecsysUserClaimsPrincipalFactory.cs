using System.Security.Claims;
using System.Threading.Tasks;
using Decsys.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Decsys.Auth
{
    public class DecsysUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<DecsysUser>
    {
        public DecsysUserClaimsPrincipalFactory(
            UserManager<DecsysUser> userManager,
            IOptions<IdentityOptions> optionsAccessor)
                : base(userManager, optionsAccessor)
        {
        }

        protected override async Task<ClaimsIdentity> GenerateClaimsAsync(DecsysUser user)
        {
            var identity = await base.GenerateClaimsAsync(user);
            identity.AddClaim(new Claim(CustomClaimTypes.FullName, user.Fullname));
            return identity;
        }
    }
}
