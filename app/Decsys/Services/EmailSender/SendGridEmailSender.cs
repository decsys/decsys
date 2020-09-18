using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Decsys.Config;
using Decsys.Services.Contracts;
using Decsys.Services.EmailServices;
using DnsClient.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Decsys.Services.EmailSender
{
    public class SendGridEmailSender : IEmailSender
    {
        private readonly SendGridOptions _config;
        private readonly RazorViewService _emailViews;
        private readonly ILogger<SendGridEmailSender> _logger;
        private readonly SendGridClient _sendGrid;

        public SendGridEmailSender(
            IOptions<SendGridOptions> options,
            RazorViewService emailViews,
            ILogger<SendGridEmailSender> logger)
        {
            _config = options.Value;
            _emailViews = emailViews;
            _logger = logger;
            _sendGrid = new SendGridClient(_config.SendGridApiKey);
        }
        public async Task SendEmail<TModel>(
            Models.Emails.EmailAddress toAddress,
            string subject,
            string viewName,
            TModel model)
            where TModel : class
            => await SendEmail(
                new List<Models.Emails.EmailAddress>() { toAddress },
                subject, viewName, model);

        public async Task SendEmail<TModel>(
            List<Models.Emails.EmailAddress> toAddresses,
            string subject,
            string viewName,
            TModel model)
            where TModel : class
        {
            var message = new SendGridMessage
            {
                From = new EmailAddress(_config.FromAddress, _config.FromName),
                ReplyTo = new EmailAddress(_config.ReplyToAddress),
                Subject = subject,
                PlainTextContent = await _emailViews.ViewAsString(
                    viewName,
                    model)
            };

            if (_emailViews.ViewExists($"{viewName}Html"))
                message.HtmlContent = await _emailViews.ViewAsString($"{viewName}Html", model);

            foreach (var address in toAddresses)
                message.AddTo(address.Address, address.Name);

            var response = await _sendGrid.SendEmailAsync(message);
            var success = ((int)response.StatusCode).ToString().StartsWith("2");
            if (!success)
            {
                var error = $"Error response from SendGrid: {response.StatusCode}";
                _logger.LogError(error);

                // Helpful bits
                if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
                    _logger.LogError(
                        $"Have you setup a verified Sender, and does it match the configured FromAddress ({_config.FromAddress})?");

                throw new InvalidOperationException(error);
            }
        }
    }
}
