using AutoMapper;
using Decsys.Models.Wordlist;
using Decsys.Repositories.Contracts;
using static Microsoft.ApplicationInsights.MetricDimensionNames.TelemetryContext;

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

    public UserWordlist List(int wordlistId)
        => _wordlist.List(wordlistId);

    public void Create(string userId)
    => _wordlist.Create(userId);

}
