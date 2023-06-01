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

    public Task<UserWordlist> Create(string ownerId)
    {
        throw new NotImplementedException();
    }
} 
