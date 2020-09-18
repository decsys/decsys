namespace Decsys.Models.Emails
{
    public record BaseAccountEmailModel(string ServiceName);
    public record AccountEmailModel<T>(string ServiceName, T EmailModel) : BaseAccountEmailModel(ServiceName)
        where T : class;

    public record AccountConfirmationModel(string Name, string Link);

    public record AccountApprovalRequestModel(EmailAddress AccountEmail, string ApproveLink, string RejectLink);
}
