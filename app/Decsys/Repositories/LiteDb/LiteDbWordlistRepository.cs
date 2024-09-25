using AutoMapper;
using Decsys.Constants;
using Decsys.Data;
using Decsys.Models.Wordlist;
using Decsys.Repositories.Contracts;
using LiteDB;


namespace Decsys.Repositories.LiteDb;

public class LiteDbWordlistRepository : IWordlistRepository
{
    //Wordlist will not work for LiteDb as wordlist requires a user(ownerId), liteDb does not have users set up
    public UserWordlist List(string ownerId) 
    {
        throw new NotImplementedException(); 
    }
    public List<UserWordlist> ListAll(string ownerId)
    {
        throw new NotImplementedException();
    }
    public Task<UserWordlist> Create(string ownerId)
    {
        throw new NotImplementedException();
    }
    public void UpdateName(string id, string name)
    {
        throw new NotImplementedException();
    }

    public Task<UserWordlist> GetById(string ownerId, string wordlistId)
    {
        throw new NotImplementedException();
    }
    public Task<UserWordlist> CreateWordlist(string ownerId, string name)
    {
        throw new NotImplementedException();
    }
    public Task PutRule(string wordlistId, int ruleIndex, Models.Wordlist.WordlistRules rule)
    {
        throw new NotImplementedException();
    }
    public Task Delete(string wordlistId)
    {
        throw new NotImplementedException();
    }

    public Task DeleteRule(string wordlistId, int ruleIndex)
    {
        throw new NotImplementedException();
    }

    public Task<WordlistWord> SetExcludedBuiltins(string wordlistId, string type, string word)
    {
        throw new NotImplementedException();
    }

    public Task<WordlistWord> AddCustomWord(string ownerId, string wordlistId, string type, string word)
    {
        throw new NotImplementedException();
    }

    public Task DeleteExcludedBuiltins(string wordlistId, string type, string word)
    {
        throw new NotImplementedException();
    }
} 
