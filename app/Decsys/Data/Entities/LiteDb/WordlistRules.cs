using LiteDB;

namespace Decsys.Data.Entities.LiteDb;

public class WordlistRules : BaseWordlistRules
{

    /// <summary>
    /// DO NOT USE. Only provided for ORM use.
    /// </summary>
    [Obsolete]
    public WordlistRules() : base(string.Empty, string.Empty, string.Empty) { }

    /// <summary>
    /// Creates a world list rules with a sepcified type, targetProperty and Operator.
    /// </summary>
    /// <param name="type">The word list type.</param>
    /// <param name="targetProperty">The word list target property .</param>
    /// <param name="operator">The word list operator</param>

    public WordlistRules(string type, string targetProperty, string @operator) : base(type, targetProperty, @operator) { }

    public BsonDocument Value { get; set; } = new BsonDocument();

}
