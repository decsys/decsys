using Decsys.Models.Wordlist;

namespace Decsys.Repositories.Contracts;

public interface IWordlistRepository
{
    List<UserWordlist> List(string userId);
    int Create(string ownerId);
}
