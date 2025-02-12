using Decsys.Models;
using Decsys.Repositories.Contracts;

namespace Decsys.Repositories.LiteDb;

public class LiteDbFolderRepository : IFolderRepository
{

    public async Task<Folder> Create(string name, string? ownerId = null)
    {
        throw new NotImplementedException(); 
    }

    public async Task<Folder?> GetByName(string name, string? ownerId = null)
    { 
        throw new NotImplementedException(); 
    }
    public async Task<PagedFolderSummary> List(string? ownerId = null, int pageIndex = 0, int pageSize = 10)
    {
        throw new NotImplementedException(); 
    }
    public async Task Delete(string name, string? ownerId = null)
    {
        throw new NotImplementedException(); 
    }
    public async Task AddFolderCountForStudy(int id)
    {
        throw new NotImplementedException(); 
    }
    public async Task SubstractFolderCountForStudy(int id)
    {
        throw new NotImplementedException(); 
    }
    
}
