using MongoDB.Bson;

namespace Decsys.Data.Entities.Mongo;

public class UserWordlist : BaseUserWordlist
{
    public ObjectId Id { get; set; }
    public string Owner { get; set; } = string.Empty;
} 
