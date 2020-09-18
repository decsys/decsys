using System.Threading.Tasks;

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
            string toAddress,
            string subject,
            string viewName,
            TModel model,
            string? toName = null)
            where TModel : class;
    }
}
