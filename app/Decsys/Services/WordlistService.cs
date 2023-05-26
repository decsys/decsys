using AutoMapper;
using Decsys.Models.Wordlist;
using Decsys.Repositories.Contracts;

namespace Decsys.Services;

public class WordlistService
{
    private readonly IWordlistRepository _wordlist;
    private readonly IMapper _mapper;

    public WordlistService(
        IWordlistRepository wordlist,
        IMapper mapper)
    {
        _wordlist = wordlist;
        _mapper = mapper;
    }

    public IEnumerable<UserWordlist> List(string userId)
        => _wordlist.List(userId);

    public int Create(string userId) => _wordlist.Create(userId);


}
