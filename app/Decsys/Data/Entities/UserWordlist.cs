using Decsys.Models.Wordlist;

namespace Decsys.Data.Entities;

public class UserWordlist
{
    public int Id { get; set; }
    public DecsysUser Owner { get; set; } = null!;
    public WordlistOptions Options { get; set; } = new();
    public List<WordlistRules> Rules { get; set; } = new();
    public List<WordlistWord> ExcludeWords { get; set; } = new();
    public List<WordlistWord> IncludeWords { get; set; } = new();
}
