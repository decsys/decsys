namespace Decsys.Models.Wordlist;

public class UserWordlist
{
    public string Id { get; set; } = string.Empty;
    public WordlistOptions Options { get; set; } = new();
    public List<WordlistRules> Rules { get; set; } = new();
    public List<WordlistWord> ExcludeWords { get; set; } = new();
    public List<WordlistWord> IncludeWords { get; set; } = new();
}
