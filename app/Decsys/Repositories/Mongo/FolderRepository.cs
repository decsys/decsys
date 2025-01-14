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

    public async Task<Models.Folder> Create(string name, string? ownerId = null)
    {
        if (string.IsNullOrWhiteSpace(ownerId))
        {
            throw new UnauthorizedAccessException();
        }

        var entity = new Folder
        {
            Name = name,
            Owner = ownerId
        };
        await _folders.InsertOneAsync(entity);

        var userFolder = _mapper.Map<Models.Folder>(entity);
        return userFolder;
    }

    public async Task<Models.Folder?> GetByName(string name, string? ownerId = null)
    {
        var entity = await _folders.Find(f => f.Name == name && f.Owner == ownerId).FirstOrDefaultAsync();
        if (entity == null)
            return null;

        return _mapper.Map<Models.Folder>(entity);
    }

    public async Task<IEnumerable<Models.Folder>> List(string? ownerId = null)
    {
        if (string.IsNullOrWhiteSpace(ownerId))
        {
            throw new UnauthorizedAccessException();
        }

        var entities = await _folders.Find(f => f.Owner == ownerId).ToListAsync();
        return _mapper.Map<IEnumerable<Models.Folder>>(entities);
    }
}
