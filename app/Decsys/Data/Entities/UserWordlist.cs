using Decsys.Models.Wordlist;
using MongoDB.Bson;

namespace Decsys.Data.Entities;

public class UserWordlist
{
    public ObjectId Id { get; set; }
    public string Owner { get; set; } = string.Empty;
    public WordlistOptions Options { get; set; } = new();
    public List<WordlistRules> Rules { get; set; } = new();
    public List<WordlistWord> ExcludeWords { get; set; } = new();
    public List<WordlistWord> IncludeWords { get; set; } = new();
}
