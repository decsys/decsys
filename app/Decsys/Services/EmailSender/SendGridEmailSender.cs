using System;
using System.Threading.Tasks;
using Decsys.Config;
using Decsys.Services.Contracts;
using DnsClient.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using UoN.AspNetCore.RazorViewRenderer;

namespace Decsys.Services.EmailSender
{
    public class SendGridEmailSender : IEmailSender
    {
        private readonly SendGridOptions _config;
        private readonly IRazorViewRenderer _emailViews;
        private readonly ILogger<SendGridEmailSender> _logger;
        private readonly SendGridClient _sendGrid;

        public SendGridEmailSender(
            IOptions<SendGridOptions> options,
            IRazorViewRenderer emailViews,
            ILogger<SendGridEmailSender> logger)
        {
            _config = options.Value;
            _emailViews = emailViews;
            _logger = logger;
            _sendGrid = new SendGridClient(_config.SendGridApiKey);
        }

        public async Task SendEmail<TModel>(string toAddress, string subject, string viewName, TModel model, string? toName = null)
            where TModel : class
        {
            var message = new SendGridMessage
            {
                From = new EmailAddress(_config.FromAddress, _config.FromName),
                ReplyTo = new EmailAddress(_config.ReplyToAddress),
                Subject = subject,
                PlainTextContent = await _emailViews.AsString(
                    viewName,
                    model)
            };
            message.AddTo(toAddress, toName);
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
