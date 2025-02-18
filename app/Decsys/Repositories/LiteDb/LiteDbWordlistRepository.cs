using AutoMapper;
using Decsys.Constants;
using Decsys.Data;
using Decsys.Data.Entities.LiteDb;
using Decsys.Repositories.Contracts;
using LiteDB;


namespace Decsys.Repositories.LiteDb;

public class LiteDbWordlistRepository : IWordlistRepository
{
    private readonly ILiteCollection<UserWordlist> _wordlist;
    private readonly IMapper _mapper;

    public LiteDbWordlistRepository(LiteDbFactory db, IMapper mapper)
    {
        _mapper = mapper;
        _wordlist = db.Surveys.GetCollection<UserWordlist>(Collections.UserWordlists);
    }

    public Models.Wordlist.UserWordlist List(string? ownerId) 
    {
        var wordlist = _wordlist.FindOne(Query.All(Query.Ascending));

        return _mapper.Map<Models.Wordlist.UserWordlist>(wordlist);
    }
    public List<Models.Wordlist.UserWordlist> ListAll(string? ownerId)
    {
        var wordlists = _wordlist.FindAll().ToList();
        return _mapper.Map<List<Models.Wordlist.UserWordlist>>(wordlists);
    }
    public Task<Models.Wordlist.UserWordlist> Create(string? ownerId)
    {
        var userWordlist = new UserWordlist{};
        _wordlist.Insert(userWordlist);

        return Task.FromResult(_mapper.Map<Models.Wordlist.UserWordlist>(userWordlist));
    }
    public void UpdateName(string id, string name)
    {
        var wordlist = _wordlist.FindById(new BsonValue(id));
        if (wordlist == null)
            throw new KeyNotFoundException("Wordlist not found.");

        wordlist.Name = name;
        _wordlist.Update(wordlist);
    }

    public Task<Models.Wordlist.UserWordlist> GetById(string? ownerId, string wordlistId)
    {
        var bsonId = new ObjectId(wordlistId);
        var wordlist = _wordlist.FindById(bsonId);
        if (wordlist == null)
            throw new KeyNotFoundException("Wordlist not found with ID: " + wordlistId);

        return Task.FromResult(_mapper.Map<Models.Wordlist.UserWordlist>(wordlist));
    }

    public Task<Models.Wordlist.UserWordlist> CreateWordlist(string? ownerId, string name)
    {
        var userWordlist = new UserWordlist
        {
            Name = name
        };

        _wordlist.Insert(userWordlist);

        return Task.FromResult(_mapper.Map<Models.Wordlist.UserWordlist>(userWordlist));
    }
    public Task PutRule(string wordlistId, int ruleIndex, Models.Wordlist.WordlistRules rule)
    {
        var wordlist = _wordlist.FindById(new BsonValue(wordlistId));
        if (wordlist == null)
            throw new KeyNotFoundException("Wordlist not found.");
        _wordlist.Update(wordlist);
        return Task.CompletedTask;
    }
    public Task Delete(string wordlistId)
    {
        var bsonId = new ObjectId(wordlistId);

        bool deleted = _wordlist.Delete(bsonId);
        if (!deleted)
        {
            throw new KeyNotFoundException($"Wordlist not found with ID: {wordlistId}.");
        }

        return Task.CompletedTask;
    }

    public Task DeleteRule(string wordlistId, int ruleIndex)
    {
        var wordlist = _wordlist.FindById(new BsonValue(wordlistId));
        if (wordlist == null)
            throw new KeyNotFoundException("Wordlist not found.");

        if (ruleIndex < 0 || ruleIndex >= wordlist.Rules.Count)
            throw new Exception("Invalid rule index.");

        wordlist.Rules.RemoveAt(ruleIndex);
        _wordlist.Update(wordlist);

        return Task.CompletedTask;
    }


    public Task<Models.Wordlist.WordlistWord> SetExcludedBuiltins(string wordlistId, string type, string word)
    {
        var wordlist = _wordlist.FindById(new BsonValue(wordlistId));
        if (wordlist == null)
            throw new KeyNotFoundException("Wordlist not found.");

        var newExcludedBuiltins = new Data.Entities.WordlistWord { Type = type, Word = word };
        wordlist.ExcludedBuiltins.Add(newExcludedBuiltins);
        _wordlist.Update(wordlist);

        return Task.FromResult(_mapper.Map<Models.Wordlist.WordlistWord>(newExcludedBuiltins));
    }

    public Task<Models.Wordlist.WordlistWord> AddCustomWord(string? ownerId, string wordlistId, string type, string word)
    {
        var bsonId = new ObjectId(wordlistId);

        var wordlist = _wordlist.FindById(bsonId);
        if (wordlist == null)
            throw new KeyNotFoundException("Wordlist not found.");

        var newCustomWord = new Data.Entities.WordlistWord { Type = type, Word = word };
        wordlist.CustomWords.Add(newCustomWord);
        _wordlist.Update(wordlist);

        return Task.FromResult(_mapper.Map<Models.Wordlist.WordlistWord>(newCustomWord));
    }

    public Task DeleteCustomWord(string? ownerId, string wordlistId, string type, string word)
    {
        var wordlist = _wordlist.FindById(new ObjectId(wordlistId));
        if (wordlist == null)
            throw new KeyNotFoundException("Wordlist not found.");

        var customWordToRemove = wordlist.CustomWords.Find(w => w.Type == type && w.Word == word);
        if (customWordToRemove != null)
        {
            wordlist.CustomWords.Remove(customWordToRemove);
            _wordlist.Update(wordlist);
        }
        else
        {
            throw new Exception("Custom word not found in the wordlist.");
        }

        return Task.CompletedTask;
    }
    public Task DeleteExcludedBuiltins(string wordlistId, string type, string word)
    {
        var wordlist = _wordlist.FindById(new BsonValue(wordlistId));
        if (wordlist == null)
            throw new KeyNotFoundException("Wordlist not found.");

        var builtinToExclude = wordlist.ExcludedBuiltins.Find(w => w.Type == type && w.Word == word);
        if (builtinToExclude != null)
        {
            wordlist.ExcludedBuiltins.Remove(builtinToExclude);
            _wordlist.Update(wordlist);
        }
        else
        {
            throw new Exception("Excluded builtin not found in the wordlist.");
        }

        return Task.CompletedTask;
    }
} 
