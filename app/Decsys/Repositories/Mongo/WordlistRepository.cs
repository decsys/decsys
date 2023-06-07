using AutoMapper;
using Decsys.Config;
using Decsys.Constants;
using Decsys.Repositories.Contracts;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

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

    public async Task<Models.Wordlist.UserWordlist> Create(string ownerId)
    {

        var userWordlistEntity = new Data.Entities.Mongo.UserWordlist
        {
            Owner =  ownerId 
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

    public async Task<Models.Wordlist.WordlistWord> SetExcludedWord(string wordlistId, string type, string word)
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
        var existingWord = wordlist.ExcludeWords.FirstOrDefault(w => w.Type == type && w.Word == word);

        if (existingWord != null)
        {
            return _mapper.Map<Models.Wordlist.WordlistWord>(existingWord);
        }

        // If word doesn't exist, create a new one and add to list
        var newExcludedWord = new Data.Entities.WordlistWord { Type = type, Word = word };
        wordlist.ExcludeWords.Add(newExcludedWord);

        var updateDefinition = Builders<Data.Entities.Mongo.UserWordlist>.Update.Set(wl => wl.ExcludeWords, wordlist.ExcludeWords);
        await _wordlists.UpdateOneAsync(wl => wl.Id == objectId, updateDefinition);

        return _mapper.Map<Models.Wordlist.WordlistWord>(newExcludedWord);
    }

}
