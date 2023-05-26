using Decsys.Data.Entities;
namespace Decsys.Models.Wordlist;

public class UserWordlist
{
    public int Id { get; set; }
    public string Owner { get; set; } = null!;
    public WordListOptions Options { get; set; } = new();
    public List<WordlistRules> Rules { get; set; } = new();
    public List<WordlistWord> ExcludeWords { get; set; } = new();
    public List<WordlistWord> IncludeWords { get; set; } = new();
}
