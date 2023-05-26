using AutoMapper;
using Decsys.Config;
using Decsys.Constants;
using Decsys.Data;
using Decsys.Models.Wordlist;
using Decsys.Repositories.Contracts;
using LiteDB;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Decsys.Repositories.LiteDb;

public class LiteDbWordlistRepository : IWordlistRepository
{
    private readonly LiteDbFactory _db;
    private readonly IMapper _mapper;


    public LiteDbWordlistRepository(LiteDbFactory db,
        IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public List<UserWordlist> List(int userId)
    {
        var words = _db.InstanceEventLogs(userId).GetCollection<UserWordlist>(Collections.UserWordlists);
        return _mapper.Map<List<UserWordlist>>(words);
    }
}
