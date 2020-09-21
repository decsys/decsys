using System;
using System.Linq;
using System.Threading.Tasks;
using Decsys.Models.Emails;
using Decsys.Services.Contracts;
using Microsoft.Extensions.Configuration;

namespace Decsys.Services.EmailServices
{
    public class AccountEmailService
    {
        private readonly IEmailSender _emails;
        private readonly IConfiguration _config;

        private const string _serviceName = "DECSYS"; // TODO: Config

        public AccountEmailService(
            IEmailSender emails,
            IConfiguration config)
        {
            _emails = emails;
            _config = config;
        }

        public async Task SendAccountConfirmation(EmailAddress to, string link)
            => await _emails.SendEmail(
                to,
                $"{_serviceName} Account Confirmation",
                "Emails/AccountConfirmation",
                new AccountEmailModel<AccountConfirmationModel>(
                    _serviceName,
                    new(to.Name!, link)));

        public async Task SendAccountApprovalRequest(EmailAddress accountEmail, string approveLink, string rejectLink)
        {
            var approvers = _config["Hosted:AccountApprovers"];
            if (string.IsNullOrWhiteSpace(approvers))
                throw new InvalidOperationException(
                    "Account Approval is required, but no approvers have been configured!");

            await _emails.SendEmail(
                approvers.Split(",")
                    .Select(address => new EmailAddress(address))
                    .ToList(),
                $"{_serviceName} Account Approval Requested",
                "Emails/AccountApprovalRequest",
                new AccountEmailModel<AccountApprovalRequestModel>(
                    _serviceName,
                    new(accountEmail, approveLink, rejectLink)));
        }

        public async Task SendAccountApprovalResult(EmailAddress to, bool isApproved, string loginLink)
            => await _emails.SendEmail(to,
                $"Your {_serviceName} Account Registration",
                "Emails/AccountApprovalResult",
                new AccountEmailModel<AccountApprovalResultModel>(
                    _serviceName,
                    new(to.Name!, isApproved, loginLink)));

        //public async Task SendPasswordReset(string to, string name, string link)
        //    => await _emails.SendEmail(
        //        to,
        //        "UKCRC Tissue Directory Password Reset",
        //        "Emails/PasswordReset",
        //        new PasswordResetModel(name, link),
        //        name);
    }
}
