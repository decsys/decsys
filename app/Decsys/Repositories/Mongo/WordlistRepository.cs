using AutoMapper;
using Decsys.Config;
using Decsys.Constants;
using Decsys.Models.Wordlist;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Decsys.Repositories.Mongo;

public class WordlistRepository
{
    private readonly IMongoCollection<UserWordlist> _wordList;
    private readonly IMapper _mapper;


    public WordlistRepository(IMongoClient mongo,
        IOptions<HostedDbSettings> config,
        IMapper mapper)
    {
        _wordList = mongo.GetDatabase(config.Value.DatabaseName)
            .GetCollection<UserWordlist>(Collections.UserWordlists);
        _mapper = mapper;
    }

    public List<UserWordlist> List(int userId)
    {
        var words = _wordList.Find(x => x.Id == userId) ?? throw new KeyNotFoundException();
        return _mapper.Map<List<UserWordlist>>(words);
    }
}
