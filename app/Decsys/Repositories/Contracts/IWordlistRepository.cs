using Decsys.Models.Wordlist;

namespace Decsys.Repositories.Contracts;

public interface IWordlistRepository
{
    UserWordlist List(string? ownerId);
    void UpdateName(string id, string name);

    List<UserWordlist> ListAll(string? ownerId);
    Task<UserWordlist> Create(string? ownerId);
    Task<UserWordlist> CreateWordlist(string? ownerId, string name);
    Task<UserWordlist> GetById(string? ownerId, string wordlistId);
    Task PutRule(string wordlistId, int ruleIndex, WordlistRules ruled);
    Task<WordlistWord> SetExcludedBuiltins(string wordlistId, string type, string word);
    Task<WordlistWord> AddCustomWord(string? ownerId, string wordlistId, string type, string word);
    Task Delete(string wordlistId);
    Task DeleteRule(string wordlistId, int ruleIndex);
    Task DeleteExcludedBuiltins(string wordlistId, string type, string word);
    Task DeleteCustomWord(string? ownerId, string wordlistId, string type, string customWord);
}
