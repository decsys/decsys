using Decsys.Models;

namespace Decsys.Repositories.Contracts;

public interface IFolderRepository
{
    Task<Folder> Create(string name, string? ownerId = null);
    Task<Folder> GetByName(string name, string? ownerId = null);
    Task<IEnumerable<Folder>> List(string? ownerId = null);
}
