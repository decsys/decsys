namespace Decsys.Config;

public class Webhooks
{
    public string GlobalRedirectUrl { get; set; } = string.Empty;
    public bool OverrideWebhookForDev { get; set; } = true;
}
