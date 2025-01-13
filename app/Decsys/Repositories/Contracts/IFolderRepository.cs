using Decsys.Models;

namespace Decsys.Repositories.Contracts;

public interface IFolderRepository
{   
    string Create(string name, string? ownerId = null);
}
