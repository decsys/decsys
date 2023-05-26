using AutoMapper;
using Decsys.Config;
using Decsys.Constants;
using Decsys.Data.Entities;
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

    public List<UserWordlist> List(string ownerId)
    {
        var words = _wordList.Find(ownerId) ?? throw new KeyNotFoundException();
        return _mapper.Map<List<UserWordlist>>(words);
    }
    public UserWordlist Create(string ownerId)
    {
        var wordlist = new UserWordlist
        {
            Owner = ownerId
        };

        _wordList.InsertOne(wordlist);

        return _mapper.Map<UserWordlist>(wordlist);
    }
}
