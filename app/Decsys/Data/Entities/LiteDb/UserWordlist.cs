using Decsys.Models.Wordlist;

namespace Decsys.Data.Entities.LiteDb;

public class UserWordlist : BaseUserWordlist
{
    public List<WordlistRules> Rules { get; set; } = new();
}
