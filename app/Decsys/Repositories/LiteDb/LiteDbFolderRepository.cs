using Decsys.Models;
using Decsys.Repositories.Contracts;

namespace Decsys.Repositories.LiteDb;

public class LiteDbFolderRepository : IFolderRepository
{
    public string Create(string name, string? ownerId = null)
    {
        throw new NotImplementedException();
    }
}
