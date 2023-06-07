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

    public async Task<UserWordlist> Create(string ownerId)
    => await _wordlist.Create(ownerId);

    public async Task PutRule(string wordlistId, int ruleIndex, Models.Wordlist.WordlistRules rule)
    {
        await _wordlist.PutRule(wordlistId, ruleIndex,rule);
    }
    public async Task DeleteRule(string wordlistId, int ruleIndex)
    {
        await _wordlist.DeleteRule(wordlistId, ruleIndex);
    }

    public async Task<WordlistWord> SetExcludedWord(string wordlistId, string type, string word)
    => await _wordlist.SetExcludedWord(wordlistId, type, word);
}
