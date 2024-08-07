using MongoDB.Bson;

namespace Decsys.Data.Entities.Mongo;

public class UserWordlist
{
    public ObjectId Id { get; set; }
    public string Owner { get; set; } = string.Empty;
    public string Name { get; set; } = "Untitled Wordlist";
    public WordlistOptions Options { get; set; } = new();
    public List<WordlistRules> Rules { get; set; } = new();
    public List<WordlistWord> ExcludedBuiltins { get; set; } = new();
    public List<WordlistWord> CustomWords { get; set; } = new();
} 
