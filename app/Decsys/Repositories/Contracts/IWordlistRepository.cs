using Decsys.Models.Wordlist;

namespace Decsys.Repositories.Contracts;

public interface IWordlistRepository
{
    UserWordlist List(string ownerId);
    Task<UserWordlist> Create(string ownerId);
    Task PutRule(string wordlistId, int ruleIndex, WordlistRules ruled);
    Task<WordlistWord> SetExcludedBuiltins(string wordlistId, string type, string word);
    Task DeleteRule(string wordlistId, int ruleIndex);
    Task DeleteExcludedBuiltins(string wordlistId, string type, string word);
}
