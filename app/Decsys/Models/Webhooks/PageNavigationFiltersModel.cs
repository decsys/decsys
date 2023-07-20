namespace Decsys.Models.Webhooks;

public class PageNavigationFiltersModel
{
    /// <summary>
    /// The page the user is leaving.
    /// </summary>
    public int SourcePage { get; set; }
    
    /// <summary>
    /// Whether the navigation was successful.
    /// </summary>
    public bool ResolvedSuccess { get; set; }
}
