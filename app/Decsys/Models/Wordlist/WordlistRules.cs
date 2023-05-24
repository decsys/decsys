namespace Decsys.Models.Wordlist;

public class WordlistRules
{
    public string Type { get; set; } = string.Empty;
    public bool IsInclusionCriteria { get; set; }
    public string TargetProperty { get; set; } = string.Empty;
    public string Operator { get; set; } = string.Empty;
}
