using Decsys.Models;

namespace Decsys.Repositories.Contracts;

public interface IFolderRepository
{
    Task<Folder> Create(string name, string ownerId);
}
