namespace Decsys.Models.Wordlist;

public class Wordlist
{
    public int Id { get; set; }
    public WordListOptions Options { get; set; } = new();
    public List<WordlistRules> Rules { get; set; } = new();
    public List<WordlistWord> ExcludeWords { get; set; } = new();
    public List<WordlistWord> IncludeWords { get; set; } = new();
}

