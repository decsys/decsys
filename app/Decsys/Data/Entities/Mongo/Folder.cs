using MongoDB.Bson;

namespace Decsys.Data.Entities.Mongo;

public class Folder : BaseFolder
{
    public ObjectId Id { get; set; }
}
