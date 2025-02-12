using AutoMapper;
using Decsys.Constants;
using Decsys.Data;
using Decsys.Models;
using Decsys.Repositories.Contracts;
using LiteDB;


namespace Decsys.Repositories.LiteDb;

public class LiteDbFolderRepository : IFolderRepository
{
    private readonly IMapper _mapper;
    private readonly ILiteCollection<Folder> _folders;
    private readonly ISurveyRepository _surveys;

    public LiteDbFolderRepository(LiteDbFactory db, IMapper mapper, ISurveyRepository surveys)
    {
        _folders = db.Surveys.GetCollection<Folder>(Collections.Folders);
        _mapper = mapper;
        _surveys = surveys;
    }

    public async Task<Folder> Create(string name, string? ownerId = null)
    {
     
        var entity = new Folder { Name = name };
        _folders.Insert(entity);

        return _mapper.Map<Folder>(entity);
    }

    public async Task<Folder?> GetByName(string name, string? ownerId = null)
    {
        var entity = _folders.FindOne(f => f.Name == name);
        return entity != null ? _mapper.Map<Folder>(entity) : null;
    }

    public async Task<PagedFolderSummary> List(string? ownerId = null, int pageIndex = 0, int pageSize = 10)
    {
        var entities = _folders.FindAll().ToList();
        var pagedItems = entities.Skip(pageIndex * pageSize).Take(pageSize).ToList();
        var folder = _mapper.Map<List<Folder>>(pagedItems);
        var folderCount = entities.Count;

        return new PagedFolderSummary
        {
            Folders = folder,
            FolderCount = folderCount
        };
    }

    public async Task Delete(string name, string? ownerId = null)
    {

        var folder = _folders.FindOne(f => f.Name == name);
        if (folder == null)
        {
            throw new InvalidOperationException("Folder not found.");
        }

        if (folder.SurveyCount > 0)
        {
            throw new InvalidOperationException("Only folders that are empty can be deleted.");
        }

        _folders.Delete(name);
    }

    public async Task AddFolderCountForStudy(int id)
    {
        var survey = _surveys.Find(id);
        var parentFolderName = survey.ParentFolderName;

        var parentFolder = _folders.FindOne(f => f.Name == parentFolderName);
        if (parentFolder != null)
        {
            parentFolder.SurveyCount++;
            _folders.Update(parentFolder);
        }
    }

    public async Task SubstractFolderCountForStudy(int id)
    {
        var survey = _surveys.Find(id);
        var parentFolderName = survey.ParentFolderName;

        var parentFolder = _folders.FindOne(f => f.Name == parentFolderName);
        if (parentFolder != null)
        {
            parentFolder.SurveyCount--;
            _folders.Update(parentFolder);
        }
    }
}
