using Decsys.Models;

namespace Decsys.Repositories.Contracts;

public interface IFolderRepository
{
    Task<Folder> Create(string name, string? ownerId = null);
    Task<Folder?> GetByName(string name, string? ownerId = null);
    Task<IEnumerable<Folder>> List(string? ownerId = null);
    Task Delete(string name, string? ownerId = null);
    Task AddFolderCountForStudy(int id);
    Task SubstractFolderCountForStudy(int id);
}
