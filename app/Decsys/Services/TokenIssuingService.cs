using System.Text;
using System.Threading.Tasks;
using Decsys.Data.Entities;
using Decsys.Services.EmailServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.WebUtilities;

namespace Decsys.Services
{
    public class TokenIssuingService
    {
        private readonly UserManager<DecsysUser> _users;
        private readonly AccountEmailService _accountEmail;
        private readonly IUrlHelper _url;

        public TokenIssuingService(
            IActionContextAccessor actionContextAccessor,
            UserManager<DecsysUser> users,
            AccountEmailService accountEmail)
        {
            _users = users;
            _accountEmail = accountEmail;
            _url = new UrlHelperFactory()
                .GetUrlHelper(actionContextAccessor.ActionContext);
        }

        private const string _scheme = "https";

        /// <summary>
        /// Issue an AccountConfirmation token, and email the user a link.
        /// </summary>
        /// <param name="user">The user to issue the token for and send the email to.</param>
        public async Task SendAccountConfirmation(DecsysUser user)
        {
            var code = await _users.GenerateEmailConfirmationTokenAsync(user);

            await _accountEmail.SendAccountConfirmation(
                user.Email,
                user.Fullname,
                link: _url.ActionLink(
                    action: "Confirm",
                    controller: "Account",
                    values: new
                    {
                        userId = user.Id,
                        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code))
                    },
                    protocol: _scheme));
        }
    }
}
