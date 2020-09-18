using System;
using System.IO;
using System.Threading.Tasks;
using Decsys.Config;
using Decsys.Services.Contracts;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;
using UoN.AspNetCore.RazorViewRenderer;

namespace Decsys.Services.EmailSender
{
    public class LocalDiskEmailSender : IEmailSender
    {
        private readonly LocalDiskEmailOptions _config;
        private readonly IRazorViewRenderer _emailViews;

        public LocalDiskEmailSender(IOptions<LocalDiskEmailOptions> options, IRazorViewRenderer emailViews)
        {
            _config = options.Value;
            _emailViews = emailViews;
        }

        /// <inheritdoc />
        public async Task SendEmail<TModel>(string toAddress, string subject, string viewName, TModel model, string? toName)
            where TModel : class
        {
            var message = new MimeMessage();
            message.To.Add(!string.IsNullOrEmpty(toName)
                ? new MailboxAddress(toName, toAddress)
                : MailboxAddress.Parse(toAddress));
            message.From.Add(new MailboxAddress(_config.FromName, _config.FromAddress));
            message.ReplyTo.Add(MailboxAddress.Parse(_config.ReplyToAddress));
            message.Subject = subject;
            message.Body = new TextPart(TextFormat.Html)
            {
                Text = await _emailViews.AsString(viewName, model)
            };

            await message.WriteToAsync(
                Path.Combine(_config.LocalPath,
                    MessageFileName(viewName, toAddress)));
        }

        private static string ShortViewName(string viewName)
            => viewName[(viewName.LastIndexOf('/') + 1)..];

        private static string SafeIsoDate(DateTimeOffset date)
            => date.ToString("o").Replace(":", "-");

        private static string MessageFileName(string viewName, string recipient)
            => $"{ShortViewName(viewName)}_{recipient}_{SafeIsoDate(DateTimeOffset.UtcNow)}.eml";
    }
}
