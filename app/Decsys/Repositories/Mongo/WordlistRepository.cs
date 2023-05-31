using AutoMapper;
using Decsys.Config;
using Decsys.Constants;
using Decsys.Data.Entities;
using Decsys.Models.Wordlist;
using Decsys.Repositories.Contracts;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Decsys.Repositories.Mongo;

public class WordlistRepository :IWordlistRepository
{
    private readonly IMongoCollection<Data.Entities.UserWordlist> _wordlist;
    private readonly IMapper _mapper;


    public WordlistRepository(IMongoClient mongo,
        IOptions<HostedDbSettings> config,
        IMapper mapper)
    {
        _wordlist = mongo.GetDatabase(config.Value.DatabaseName)
            .GetCollection<Data.Entities.UserWordlist>(Collections.UserWordlists);
        _mapper = mapper;
    }

    public Models.Wordlist.UserWordlist List(string ownerId)
    {
        var words = _wordlist.Find(ownerId);
        return _mapper.Map<Models.Wordlist.UserWordlist>(words);
    }

    public async Task<Models.Wordlist.UserWordlist> Create(string id)
    {
        var objectId = new ObjectId(id);

        var userWordlistEntity = new Data.Entities.UserWordlist
        {
            Owner = new DecsysUser { Id = objectId }
        };

        await _wordlist.InsertOneAsync(userWordlistEntity);

        var userWordlistModel = _mapper.Map<Models.Wordlist.UserWordlist>(userWordlistEntity);

        return userWordlistModel;
    }

}
