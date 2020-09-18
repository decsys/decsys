using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Decsys.Config;
using Decsys.Models.Emails;
using Decsys.Services.Contracts;
using Decsys.Services.EmailServices;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Decsys.Services.EmailSender
{
    public class LocalDiskEmailSender : IEmailSender
    {
        private readonly LocalDiskEmailOptions _config;
        private readonly RazorViewService _emailViews;

        public LocalDiskEmailSender(
            IOptions<LocalDiskEmailOptions> options,
            RazorViewService emailViews)
        {
            _config = options.Value;
            _emailViews = emailViews;
        }

        /// <inheritdoc />
        public async Task SendEmail<TModel>(List<EmailAddress> toAddresses, string subject, string viewName, TModel model)
            where TModel : class
        {
            var message = new MimeMessage();

            foreach (var address in toAddresses)
                message.To.Add(!string.IsNullOrEmpty(address.Name)
                    ? new MailboxAddress(address.Name, address.Address)
                    : MailboxAddress.Parse(address.Address));

            message.From.Add(new MailboxAddress(_config.FromName, _config.FromAddress));
            message.ReplyTo.Add(MailboxAddress.Parse(_config.ReplyToAddress));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder
            {
                TextBody = await _emailViews.ViewAsString(viewName, model),
            };

            if (_emailViews.ViewExists($"{viewName}Html"))
                bodyBuilder.HtmlBody = await _emailViews.ViewAsString($"{viewName}Html", model);

            message.Body = bodyBuilder.ToMessageBody();

            await message.WriteToAsync(
                Path.Combine(_config.LocalPath,
                    MessageFileName(viewName, toAddresses[0].Address)));
        }

        public async Task SendEmail<TModel>(EmailAddress toAddress, string subject, string viewName, TModel model)
            where TModel : class
            => await SendEmail(new List<EmailAddress> { toAddress }, subject, viewName, model);

        private static string ShortViewName(string viewName)
            => viewName[(viewName.LastIndexOf('/') + 1)..];

        private static string SafeIsoDate(DateTimeOffset date)
            => date.ToString("o").Replace(":", "-");

        private static string MessageFileName(string viewName, string recipient)
            => $"{ShortViewName(viewName)}_{recipient}_{SafeIsoDate(DateTimeOffset.UtcNow)}.eml";
    }
}
