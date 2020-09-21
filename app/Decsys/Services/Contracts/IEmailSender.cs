using System.Collections.Generic;
using System.Threading.Tasks;
using Decsys.Models.Emails;

namespace Decsys.Services.Contracts
{
    public interface IEmailSender
    {
        /// <summary>
        /// Send an email (compiled from a Razor View with a Model)
        /// to a single email address,
        /// using the default From account.
        /// </summary>
        /// <typeparam name="TModel">The Type of the ViewModel the View expects</typeparam>
        /// <param name="toAddress">The email address to send to</param>
        /// <param name="subject">The subject line</param>
        /// <param name="viewName">a Razor View to compile to form the email content</param>
        /// <param name="model">a ViewModel instance for the specified View</param>
        /// <param name="toName">Optional name of the target recipient</param>
        Task SendEmail<TModel>(
            EmailAddress toAddress,
            string subject,
            string viewName,
            TModel model)
            where TModel : class;

        /// <summary>
        /// Send an email (compiled from a Razor View with a Model)
        /// to multiple addresses,
        /// using the default From account.
        /// </summary>
        /// <typeparam name="TModel">The Type of the ViewModel the View expects</typeparam>
        /// <param name="toAddresses">The email addresses to send to</param>
        /// <param name="subject">The subject line</param>
        /// <param name="viewName">a Razor View to compile to form the email content</param>
        /// <param name="model">a ViewModel instance for the specified View</param>
        /// <param name="toName">Optional name of the target recipient</param>
        Task SendEmail<TModel>(
            List<EmailAddress> toAddresses,
            string subject,
            string viewName,
            TModel model)
            where TModel : class;
    }
}
