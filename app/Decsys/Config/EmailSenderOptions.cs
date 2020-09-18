namespace Decsys.Config
{
    public record BaseEmailSenderOptions
    {
        public string FromName { get; init; } = "No Reply";
        public string FromAddress { get; init; } = "noreply@example.com";
    };

    public record LocalDiskEmailOptions : BaseEmailSenderOptions
    {
        public string LocalPath { get; init; } = "/temp";
    }

    //public record SendGridOptions : BaseEmailSenderOptions
    //{
    //    public string SendGridApiKey { get; init; } = string.Empty;
    //}
}
