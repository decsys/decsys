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
    private readonly ISurveyRepository _surveys;

    public FolderRepository(
        IOptions<HostedDbSettings> config,
        IMapper mapper,
        IMongoClient mongo,
        ISurveyRepository surveys)
    {
        _mapper = mapper;
        var db = mongo.GetDatabase(config.Value.DatabaseName);
        _folders = db.GetCollection<Folder>(Collections.Folders);
        _surveys = surveys;
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
        if (string.IsNullOrWhiteSpace(ownerId))
        {
            throw new UnauthorizedAccessException();
        }
        var entity = await _folders.Find(f => f.Name == name && f.Owner == ownerId).FirstOrDefaultAsync();
        if (entity == null)
            return null;

        return _mapper.Map<Models.Folder>(entity);
    }

    public async Task<Models.PagedFolderSummary> List(string? ownerId = null, int pageIndex = 0, int pageSize = 10)
    {
        if (string.IsNullOrWhiteSpace(ownerId))
        {
            throw new UnauthorizedAccessException();
        }

        var entities = await _folders.Find(f => f.Owner == ownerId).ToListAsync();
        var pagedItems = entities.Skip(pageIndex * pageSize).Take(pageSize);
        var folder = _mapper.Map<List<Models.Folder>>(pagedItems);
        var folderCount = entities.Count();
        return new Models.PagedFolderSummary
        {
            Folders = folder,
            FolderCount = folderCount
        };
    }

    public async Task Delete(string name, string? ownerId = null)
    {
        if (string.IsNullOrWhiteSpace(ownerId))
        {
            throw new UnauthorizedAccessException();
        }

        var folder = await _folders.Find(f => f.Name == name && f.Owner == ownerId).FirstOrDefaultAsync();

        if (folder == null)
        {
            throw new InvalidOperationException("Folder not found.");
        }

        if (folder.SurveyCount > 0)
        {
            throw new InvalidOperationException("Only folders that are empty can be deleted.");
        }

        await _folders.DeleteOneAsync(f => f.Name == name && f.Owner == ownerId);
    }

    public async Task AddFolderCountForStudy(int id)
    {
        var survey = _surveys.Find(id);
        var parentFolderName = survey.ParentFolderName;

        var parentFolder = _folders.Find(f => f.Name == parentFolderName).SingleOrDefault();
        parentFolder.SurveyCount++;
        await _folders.ReplaceOneAsync(f => f.Name == parentFolderName, parentFolder);  
    }

    public async Task SubstractFolderCountForStudy(int id)
    {
        var survey = _surveys.Find(id);
        var parentFolderName = survey.ParentFolderName;

        var parentFolder = _folders.Find(f => f.Name == parentFolderName).SingleOrDefault();
        parentFolder.SurveyCount--;
        await _folders.ReplaceOneAsync(f => f.Name == parentFolderName, parentFolder);
    }
}
