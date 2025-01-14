using Decsys.Models;
using Decsys.Repositories.Contracts;

namespace Decsys.Repositories.LiteDb;

public class LiteDbFolderRepository : IFolderRepository
{
    private readonly IFolderRepository _folders;

    public LiteDbFolderRepository(IFolderRepository folders)
    {
        _folders = folders;
    }

    public string Create(string name, string? ownerId = null)
    => _folders.Create(name, ownerId);
}
