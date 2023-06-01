using Decsys.Data.Entities;

namespace Decsys.Data.Entities;

public class BaseUserWordlist
{
    public int Id { get; set; }
    public DecsysUser Owner { get; set; } = null!;
    public WordlistOptions Options { get; set; } = new();
    public List<WordlistWord> ExcludeWords { get; set; } = new();
    public List<WordlistWord> IncludeWords { get; set; } = new();
}
