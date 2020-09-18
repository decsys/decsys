using System.Threading.Tasks;
using Decsys.Models.Emails;
using Decsys.Services.Contracts;

namespace Decsys.Services.EmailServices
{
    public class AccountEmailService
    {
        private readonly IEmailSender _emails;

        private const string _serviceName = "DECSYS"; // TODO: Config

        public AccountEmailService(IEmailSender emails)
        {
            _emails = emails;
        }

        public async Task SendAccountConfirmation(string to, string name, string link)
            => await _emails.SendEmail(
                to,
                $"{_serviceName} Account Confirmation",
                "Emails/AccountConfirmation",
                new AccountEmailModel<AccountConfirmationModel>(
                    _serviceName,
                    new(name, link)),
                name);

        //public async Task SendPasswordReset(string to, string name, string link)
        //    => await _emails.SendEmail(
        //        to,
        //        "UKCRC Tissue Directory Password Reset",
        //        "Emails/PasswordReset",
        //        new PasswordResetModel(name, link),
        //        name);
    }
}
