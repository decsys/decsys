using AutoMapper;
using Decsys.Config;
using Decsys.Constants;

using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using static Microsoft.ApplicationInsights.MetricDimensionNames.TelemetryContext;

namespace Decsys.Repositories.Mongo;

public class WordlistRepository
{
    private readonly IMongoCollection<Models.Wordlist.UserWordlist> _wordList;
    private readonly UserManager<Data.Entities.DecsysUser> _users;
    private readonly IMapper _mapper;


    public WordlistRepository(IMongoClient mongo,
        UserManager<Data.Entities.DecsysUser> users,
        IOptions<HostedDbSettings> config,
        IMapper mapper)
    {
        _wordList = mongo.GetDatabase(config.Value.DatabaseName)
            .GetCollection<Models.Wordlist.UserWordlist>(Collections.UserWordlists);
        _users = users;
        _mapper = mapper;
    }

    public Models.Wordlist.UserWordlist List(int ownerId)
    {
        var words = _wordList.Find(x=>x.Id==ownerId) ?? throw new KeyNotFoundException();
        return _mapper.Map<Models.Wordlist.UserWordlist>(words);
    }

    public async void Create(string userId)
    {
        var user = await _users.FindByIdAsync(userId);

        var wordlist = new Data.Entities.Mongo.UserWordlist()
        {
            Owner = user
        };

        var model = _mapper.Map<Models.Wordlist.UserWordlist>(wordlist);

        _wordList.InsertOne(model);
 
    }



}
