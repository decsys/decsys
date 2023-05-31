using AutoMapper;
using Decsys.Constants;
using Decsys.Data;
using Decsys.Models.Wordlist;
using Decsys.Repositories.Contracts;
using LiteDB;


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

    public UserWordlist List(string ownerId) 
    {
        var wordlists = _wordlists.FindById(ownerId);
        return wordlists;
    }

    public Task<UserWordlist> Create(string id)
    {
        throw new NotImplementedException();
    }
} 
