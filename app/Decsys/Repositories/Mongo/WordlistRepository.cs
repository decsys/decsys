using AutoMapper;
using Decsys.Config;
using Decsys.Constants;
using Decsys.Repositories.Contracts;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Decsys.Repositories.Mongo;

public class WordlistRepository :IWordlistRepository
{
    private readonly IMongoCollection<Data.Entities.Mongo.UserWordlist> _wordlists;
    private readonly IMapper _mapper;


    public WordlistRepository(IMongoClient mongo,
        IOptions<HostedDbSettings> config,
        IMapper mapper)
    {
        _wordlists = mongo.GetDatabase(config.Value.DatabaseName)
            .GetCollection<Data.Entities.Mongo.UserWordlist>(Collections.UserWordlists);
        _mapper = mapper;
    }

    public Models.Wordlist.UserWordlist List(string ownerId)
    {

        var wordlist = _wordlists.Find(wl => wl.Owner == ownerId).FirstOrDefault();

        return _mapper.Map<Models.Wordlist.UserWordlist>(wordlist);
    }

    public async Task<Models.Wordlist.UserWordlist> Create(string ownerId)
    {

        var userWordlistEntity = new Data.Entities.Mongo.UserWordlist
        {
            Owner =  ownerId 
        };

        await _wordlists.InsertOneAsync(userWordlistEntity);

        var userWordlistModel = _mapper.Map<Models.Wordlist.UserWordlist>(userWordlistEntity);

        return userWordlistModel;
    }

    public async Task PutRule(string wordlistId, int ruleIndex, Models.Wordlist.WordlistRules rule)
    {
        //Survice Logic
    }
}
