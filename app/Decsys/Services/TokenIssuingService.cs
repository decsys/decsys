﻿using System.Threading.Tasks;
using Decsys.Auth;
using Decsys.Data.Entities;
using Decsys.Models.Emails;
using Decsys.Services.EmailServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Routing;

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
                new EmailAddress(user.Email)
                {
                    Name = user.Fullname
                },
                link: _url.ActionLink(
                    action: "Confirm",
                    controller: "Account",
                    values: new
                    {
                        userId = user.Id,
                        code = code.Utf8ToBase64Url()
                    },
                    protocol: _scheme));
        }

        public async Task SendAccountApprovalRequest(DecsysUser user)
        {
            var code = await _users.GenerateUserTokenAsync(
                user,
                "Default",
                TokenPurpose.AccountApproval);

            await _accountEmail.SendAccountApprovalRequest(
                new EmailAddress(user.Email)
                {
                    Name = user.Fullname
                },
                approveLink: _url.ActionLink(
                    action: "Approve",
                    controller: "Account",
                    values: new
                    {
                        userId = user.Id,
                        code = code.Utf8ToBase64Url()
                    },
                    protocol: _scheme),
                rejectLink: _url.ActionLink(
                    action: "Reject",
                    controller: "Account",
                    values: new
                    {
                        userId = user.Id,
                        code = code.Utf8ToBase64Url()
                    },
                    protocol: _scheme));
        }
    }
}