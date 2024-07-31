namespace Decsys.Models.Wordlist;

public class UserWordlist
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = "Untitled Wordlist";
    public WordlistOptions Options { get; set; } = new();
    public List<WordlistRules> Rules { get; set; } = new();
    public List<WordlistWord> ExcludedBuiltins { get; set; } = new();
    public List<WordlistWord> CustomWords { get; set; } = new();
}
