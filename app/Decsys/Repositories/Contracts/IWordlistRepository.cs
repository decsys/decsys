using Decsys.Models.Wordlist;

namespace Decsys.Repositories.Contracts;

public interface IWordlistRepository
{
    UserWordlist List(string ownerId);
    Task<UserWordlist> Create(string ownerId);

}
