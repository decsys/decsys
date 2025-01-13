using MongoDB.Bson;

namespace Decsys.Data.Entities.Mongo;

public class Folder
{
    public ObjectId Id { get; set; }
    public string Name { get; set; } = string.Empty; 
    public string Owner { get; set; } = string.Empty;

}
