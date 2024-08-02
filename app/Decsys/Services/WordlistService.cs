using System.Xml.Linq;
using Decsys.Models.Wordlist;
using Decsys.Repositories.Contracts;

namespace Decsys.Services;

public class WordlistService : IWordlistRepository
{
    private readonly IWordlistRepository _wordlist;

    public WordlistService(
        IWordlistRepository wordlist)
    {
        _wordlist = wordlist;
    }

    public UserWordlist List(string ownerId)
        => _wordlist.List(ownerId);

    public List<UserWordlist> ListAll(string ownerId)
    => _wordlist.ListAll(ownerId);

    public async Task<UserWordlist> Create(string ownerId)
    => await _wordlist.Create(ownerId);

    public async Task<UserWordlist> CreateWordlist(string ownerId, string name)
    => await _wordlist.CreateWordlist(ownerId, name);

    public async Task<UserWordlist> GetById(string ownerId, string wordlistId)
    => await _wordlist.GetById(ownerId,wordlistId);

    public async Task PutRule(string wordlistId, int ruleIndex, Models.Wordlist.WordlistRules rule)
    {
        await _wordlist.PutRule(wordlistId, ruleIndex,rule);
    }

    public async Task Delete(string wordlistId)
    {
        await _wordlist.Delete(wordlistId);
    }

    public async Task DeleteRule(string wordlistId, int ruleIndex)
    {
        await _wordlist.DeleteRule(wordlistId, ruleIndex);
    }

    public async Task<WordlistWord> SetExcludedBuiltins (string wordlistId, string type, string word)
    => await _wordlist.SetExcludedBuiltins(wordlistId, type, word);

    public async Task DeleteExcludedBuiltins(string wordlistId, string type, string word)
    => await _wordlist.DeleteExcludedBuiltins(wordlistId, type, word);
}
