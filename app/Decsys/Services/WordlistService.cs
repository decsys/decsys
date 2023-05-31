using Decsys.Models.Wordlist;
using Decsys.Repositories.Contracts;

namespace Decsys.Services;

public class WordlistService : IWordlistRepository
{
    private readonly IWordlistRepository _wordlist;

    public WordlistService(
        IWordlistRepository wordlist)
    {
        _wordlist = wordlist;
    }

    public UserWordlist List(string ownerId)
        => _wordlist.List(ownerId);

    public async Task<UserWordlist> Create(string id)
    => await _wordlist.Create(id);

}
