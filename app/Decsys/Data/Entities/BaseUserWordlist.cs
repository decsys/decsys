using Decsys.Data.Entities.Mongo;
using MongoDB.Bson;

namespace Decsys.Data.Entities;

public class BaseUserWordlist
{
    public string Name { get; set; } = "Untitled Wordlist";
    public WordlistOptions Options { get; set; } = new();
    public List<WordlistRules> Rules { get; set; } = new();
    public List<WordlistWord> ExcludedBuiltins { get; set; } = new();
    public List<WordlistWord> CustomWords { get; set; } = new();
}
