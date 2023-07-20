namespace Decsys.Models.Webhooks;

public class TriggerCriteria
{
    /// <summary>
    /// Indicates whether this TriggerCriteria instance uses custom-defined triggers. 
    /// </summary>

    public bool HasCustomTriggers { get; set; }
    /// <summary>
    /// Event types that can be triggered on.
    /// </summary>
    public EventTriggerFilters EventTypes = new();
}
