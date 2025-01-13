using AutoMapper;
using Decsys.Config;
using Decsys.Constants;
using Decsys.Data.Entities.Mongo;
using Decsys.Repositories.Contracts;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Decsys.Repositories.Mongo;

public class FolderRepository : IFolderRepository
{
    private readonly IMapper _mapper;
    private readonly IMongoCollection<Folder> _folders;

    public FolderRepository(
        IOptions<HostedDbSettings> config,
        IMapper mapper,
        IMongoClient mongo)
    {
        _mapper = mapper;
        var db = mongo.GetDatabase(config.Value.DatabaseName);
        _folders = db.GetCollection<Folder>(Collections.Folders);
    }

    public async Task<Models.Folder> Create(string name, string ownerId)
    {
        var entity = new Folder
        {
            Name = name,
            Owner = ownerId
        };
        await _folders.InsertOneAsync(entity);

        var userFolder = _mapper.Map<Models.Folder>(entity);
        return userFolder;
    }
}
