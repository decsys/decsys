using Decsys.Models.Wordlist;
using Decsys.Repositories.Contracts;

namespace Decsys.Services;

public class WordlistService
{
    private readonly IWordlistRepository _wordlist;

    public WordlistService(
        IWordlistRepository wordlist) 
    {
        _wordlist = wordlist;
    }

    public IEnumerable<UserWordlist> List(string userId)
        => _wordlist.List(userId);
}
