using LiteDB;

namespace Decsys.Data.Entities.LiteDb;

public class UserWordlist : BaseUserWordlist
{
    public ObjectId Id { get; set; } = ObjectId.NewObjectId();
} 
