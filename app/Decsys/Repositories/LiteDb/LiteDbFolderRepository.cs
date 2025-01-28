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

    public async Task<Folder> Create(string name, string? ownerId = null)
    => await _folders.Create(name);

    public async Task<Folder?> GetByName(string name, string? ownerId = null)
     => await _folders.GetByName(name);

    public async Task<IEnumerable<Folder>> List(string? ownerId = null)
     => await _folders.List();

    public async Task Delete(string name, string? ownerId = null)
     => await _folders.Delete(name);
}
