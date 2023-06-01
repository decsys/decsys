using Newtonsoft.Json.Linq;

namespace Decsys.Models.Wordlist;

public class WordlistRules
{
    public WordlistRules(string type, string targetProperty, string @operator)
    {
        Type = type;
        TargetProperty = targetProperty;
        Operator = @operator;
    }

    public string Type { get; set; }
    public bool IsInclusionCriteria { get; set; }
    public string TargetProperty { get; set; }
    public string Operator { get; set; }
    public JToken Value { get; set; } = null!;
}
