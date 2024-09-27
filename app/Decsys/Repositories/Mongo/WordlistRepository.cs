using System.Globalization;
using System.Xml.Linq;
using AutoMapper;
using Decsys.Config;
using Decsys.Constants;
using Decsys.Models.Wordlist;
using Decsys.Repositories.Contracts;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using UserWordlist = Decsys.Data.Entities.Mongo.UserWordlist;

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

    public List<Models.Wordlist.UserWordlist> ListAll(string ownerId)
    {

        var wordlist = _wordlists.Find(wl => wl.Owner == ownerId).ToList();

        return _mapper.Map<List<Models.Wordlist.UserWordlist>>(wordlist);
    }

    public async Task<Models.Wordlist.UserWordlist> Create(string ownerId)
    {

        var userWordlistEntity = new Data.Entities.Mongo.UserWordlist
        {
            Owner =  ownerId ,
        };

        await _wordlists.InsertOneAsync(userWordlistEntity);

        var userWordlistModel = _mapper.Map<Models.Wordlist.UserWordlist>(userWordlistEntity);

        return userWordlistModel;
    }

    public void UpdateName(string id, string name)
    {
        if (!ObjectId.TryParse(id, out var objectId))
        {
            throw new ArgumentException("Invalid ObjectId format.", nameof(id));
        }

        _wordlists.UpdateOne(
            x => x.Id == objectId,
            Builders<UserWordlist>.Update.Set(x => x.Name, name));
    }


    public async Task<Models.Wordlist.UserWordlist> GetById(string ownerId, string wordlistId)
    {
        ObjectId objectId;
        if (!ObjectId.TryParse(wordlistId, out objectId))
        {
            throw new KeyNotFoundException("Invalid ObjectId format.");
        }

        var wordlistEntity = await _wordlists.Find(wl => wl.Id == objectId && wl.Owner == ownerId).FirstOrDefaultAsync();
        if (wordlistEntity == null)
        {
            throw new KeyNotFoundException("Wordlist not found or access is denied.");
        }

        return _mapper.Map<Models.Wordlist.UserWordlist>(wordlistEntity);
    }


    public async Task<Models.Wordlist.UserWordlist> CreateWordlist(string ownerId, string name)
    {

        if (string.IsNullOrEmpty(name))
        {
            name = "Untitled Wordlist";
        }

        var userWordlistEntity = new Data.Entities.Mongo.UserWordlist
        {
            Owner = ownerId,
            Name = name
        };

        await _wordlists.InsertOneAsync(userWordlistEntity);

        var userWordlistModel = _mapper.Map<Models.Wordlist.UserWordlist>(userWordlistEntity);

        return userWordlistModel;
    }

    public async Task PutRule(string wordlistId, int ruleIndex, Models.Wordlist.WordlistRules rule)
    {
        // Convert string to ObjectId
        ObjectId objectId;
        if (!ObjectId.TryParse(wordlistId, out objectId))
        {
            throw new Exception("Invalid ObjectId format.");
        }

        var wordlist = await _wordlists.Find(wl => wl.Id == objectId).FirstOrDefaultAsync();

        if (wordlist == null)
        {
            throw new Exception("Wordlist not found.");
        }

        if (ruleIndex < wordlist.Rules.Count)
        {
            wordlist.Rules[ruleIndex] = _mapper.Map<Data.Entities.Mongo.WordlistRules>(rule);
        }
        else if (ruleIndex == wordlist.Rules.Count)
        {
            wordlist.Rules.Add(_mapper.Map<Data.Entities.Mongo.WordlistRules>(rule));
        }
        else
        {
            throw new Exception("Invalid rule index.");
        }

        var updateDefinition = Builders<Data.Entities.Mongo.UserWordlist>.Update.Set(wl => wl.Rules, wordlist.Rules);
        await _wordlists.UpdateOneAsync(wl => wl.Id == objectId, updateDefinition);
    }
    public async Task DeleteRule(string wordlistId, int ruleIndex)
    {
        // Convert string to ObjectId
        ObjectId objectId;
        if (!ObjectId.TryParse(wordlistId, out objectId))
        {
            throw new Exception("Invalid ObjectId format.");
        }

        var wordlist = await _wordlists.Find(wl => wl.Id == objectId).FirstOrDefaultAsync();

        if (wordlist == null)
        {
            throw new Exception("Wordlist not found.");
        }

        if (ruleIndex < 0 || ruleIndex >= wordlist.Rules.Count)
        {
            throw new Exception("Invalid rule index.");
        }

        wordlist.Rules.RemoveAt(ruleIndex);

        var updateDefinition = Builders<Data.Entities.Mongo.UserWordlist>.Update.Set(wl => wl.Rules, wordlist.Rules);
        await _wordlists.UpdateOneAsync(wl => wl.Id == objectId, updateDefinition);
    }

    public async Task Delete(string wordlistId)
    {
        ObjectId objectId;
        if (!ObjectId.TryParse(wordlistId, out objectId))
        {
            throw new Exception("Invalid ObjectId format.");
        }

        var wordlist = await _wordlists.Find(wl => wl.Id == objectId).FirstOrDefaultAsync();

        if (wordlist == null)
        {
            throw new Exception("Wordlist not found.");
        }

        await _wordlists.DeleteOneAsync(wl => wl.Id == objectId);
    }


    public async Task<Models.Wordlist.WordlistWord> SetExcludedBuiltins(string wordlistId, string type, string word)
    {
        // Convert string to ObjectId
        ObjectId objectId;
        if (!ObjectId.TryParse(wordlistId, out objectId))
        {
            throw new KeyNotFoundException("Invalid ObjectId format.");
        }

        var wordlist = await _wordlists.Find(wl => wl.Id == objectId).FirstOrDefaultAsync();

        if (wordlist == null)
        {
            throw new KeyNotFoundException("Wordlist not found.");
        }

        // Look for existing word of same type in the exclusion list
        var existingWord = wordlist.ExcludedBuiltins.FirstOrDefault(w => w.Type == type && w.Word == word);

        if (existingWord != null)
        {
            return _mapper.Map<Models.Wordlist.WordlistWord>(existingWord);
        }

        // If word doesn't exist, create a new one and add to list
        var newExcludedBuiltins = new Data.Entities.WordlistWord { Type = type, Word = word };
        wordlist.ExcludedBuiltins.Add(newExcludedBuiltins);

        var updateDefinition = Builders<Data.Entities.Mongo.UserWordlist>.Update.Set(wl => wl.ExcludedBuiltins, wordlist.ExcludedBuiltins);
        await _wordlists.UpdateOneAsync(wl => wl.Id == objectId, updateDefinition);

        return _mapper.Map<Models.Wordlist.WordlistWord>(newExcludedBuiltins);
    }

    public async Task<Models.Wordlist.WordlistWord> AddCustomWord(string ownerId, string wordlistId, string type, string customWord)
    {
        if (string.IsNullOrWhiteSpace(wordlistId)) throw new ArgumentException("Wordlist ID cannot be null or empty.", nameof(wordlistId));
        if (string.IsNullOrWhiteSpace(type)) throw new ArgumentException("Type cannot be null or empty.", nameof(type));
        if (string.IsNullOrWhiteSpace(customWord)) throw new ArgumentException("Custom word cannot be null or empty.", nameof(customWord));

        if (!ObjectId.TryParse(wordlistId, out var objectId))
        {
            throw new KeyNotFoundException("Invalid ObjectId format.");
        }

        var wordlist = await _wordlists.Find(wl => wl.Id == objectId && wl.Owner == ownerId).FirstOrDefaultAsync();
        if (wordlist == null)
        {
            throw new KeyNotFoundException("Wordlist not found.");
        }

        if (wordlist.CustomWords.Any(w => w.Word.Equals(customWord,StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException("This word already exists in the custom words list.");
        }

        if (type.ToLower() == WordType.Noun.ToString().ToLowerInvariant())
        {
            customWord = char.ToUpper(customWord[0]) + customWord.Substring(1);
        }
        
        if (type.ToLower() == WordType.Adjective.ToString().ToLowerInvariant())
        {
            customWord = char.ToLower(customWord[0]) + customWord.Substring(1);
        }

        var newCustomWord = new Data.Entities.WordlistWord { Type = type, Word = customWord };

        wordlist.CustomWords.Add(newCustomWord);

        var filter = Builders<UserWordlist>.Filter.Eq(wl => wl.Id, objectId);
        var update = Builders<UserWordlist>.Update.Push(wl => wl.CustomWords, newCustomWord);
        await _wordlists.UpdateOneAsync(filter, update);

        return _mapper.Map<Models.Wordlist.WordlistWord>(newCustomWord); 
    }

    public async Task DeleteCustomWord(string ownerId, string wordlistId, string type, string customWord)
    {
        if (!ObjectId.TryParse(wordlistId, out var objectId))
        {
            throw new KeyNotFoundException("Invalid ObjectId format.");
        }
        var wordlist = await _wordlists.Find(wl => wl.Id == objectId && wl.Owner == ownerId).FirstOrDefaultAsync();
        if (wordlist == null)
        {
            throw new KeyNotFoundException("Wordlist not found.");
        }
        
        var customWordTodelete = wordlist.CustomWords.FirstOrDefault(w => w.Type == type && w.Word == customWord);

        if (customWordTodelete != null)
        {
            wordlist.CustomWords.Remove(customWordTodelete);

            var updateDefinition = Builders<Data.Entities.Mongo.UserWordlist>.Update.Set(wl => wl.CustomWords, wordlist.CustomWords);
            await _wordlists.UpdateOneAsync(wl => wl.Id == objectId, updateDefinition);
        }
        else
        {
            throw new Exception("Excluded word not found in the wordlist.");
        }
    }

    public async Task DeleteExcludedBuiltins(string wordlistId, string type,string word)
    {
        // Convert string to ObjectId
        ObjectId objectId;
        if (!ObjectId.TryParse(wordlistId, out objectId))
        {
            throw new Exception("Invalid ObjectId format.");
        }

        var wordlist = await _wordlists.Find(wl => wl.Id == objectId).FirstOrDefaultAsync();

        if (wordlist == null)
        {
            throw new Exception("Wordlist not found.");
        }

        var builtinsToExclude = wordlist.ExcludedBuiltins.FirstOrDefault(w => w.Type == type && w.Word == word);

        if (builtinsToExclude != null)
        {
            wordlist.ExcludedBuiltins.Remove(builtinsToExclude);

            var updateDefinition = Builders<Data.Entities.Mongo.UserWordlist>.Update.Set(wl => wl.ExcludedBuiltins, wordlist.ExcludedBuiltins);
            await _wordlists.UpdateOneAsync(wl => wl.Id == objectId, updateDefinition);
        }
        else
        {
            throw new Exception("Excluded word not found in the wordlist.");
        }
    }
}
