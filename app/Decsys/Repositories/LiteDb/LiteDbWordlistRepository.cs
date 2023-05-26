using AutoMapper;
using Decsys.Config;
using Decsys.Constants;
using Decsys.Data;
using Decsys.Data.Entities;
using Decsys.Models.Wordlist;
using Decsys.Repositories.Contracts;
using LiteDB;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Decsys.Repositories.LiteDb;

public class LiteDbWordlistRepository : IWordlistRepository
{
    private readonly ILiteCollection<UserWordlist> _wordlists;
    private readonly IMapper _mapper;


    public LiteDbWordlistRepository(
        LiteDbFactory db,
        IMapper mapper)
    {
        _wordlists = db.Surveys.GetCollection<UserWordlist>(Collections.UserWordlists);
        _mapper = mapper;
    }

    public List<UserWordlist> List(string userId)
    {
        var entities = _wordlists.Find(x => x.Owner == userId).ToList();
        var wordlists = _mapper.Map<List<UserWordlist>>(entities);
        return wordlists;
    }
    public int Create(string ownerId)
    {
        var wordlist = new UserWordlist { Owner = ownerId };
        var wordlistId = _wordlists.Insert(wordlist);
        return wordlistId;
    }
}
