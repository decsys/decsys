namespace Decsys.Data.Entities.Mongo;

public class UserWordlist : BaseUserWordlist
{
    public List<WordlistRules> Rules { get; set; } = new();
}
