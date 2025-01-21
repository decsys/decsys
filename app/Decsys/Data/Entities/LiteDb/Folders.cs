using LiteDB;

namespace Decsys.Data.Entities.LiteDb;

public class Folder : BaseFolder
{
    [BsonId] 
    public  string Name { get; set; } = string.Empty;
}
