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
        _wordlists = db.Surveys.GetCollection<UserWordlist>(Collections.Wordlists);
        _mapper = mapper;
    }

    public UserWordlist List(int userId)
    {
        var wordlists = _wordlists.FindById(userId);
        return wordlists;
    }
    public int Create()
    {
        var wordlist = new UserWordlist { };
        var wordlistId = _wordlists.Insert(wordlist);
        return wordlistId;
    }
}
