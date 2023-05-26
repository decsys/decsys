using Decsys.Models.Wordlist;

namespace Decsys.Repositories.Contracts;

public interface IWordlistRepository
{
    /// <summary>
    /// Lits words
    /// </summary>
    /// <param name="userId">User Id</param>
    /// <returns>List of words</returns>
    List<UserWordlist> List(int userId);
}
