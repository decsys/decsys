using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Decsys.Data.Entities.Mongo;

public class Folder : BaseFolder
{
    [BsonId]
    public string Name { get; set; } = string.Empty;

}
