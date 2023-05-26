namespace Decsys.Models.Wordlist;

public class Wordlist
{
    public int SurveyId { get; set; }
    public List<UserWordlist> UserWordLlists { get; set; } = new();
    public List<WordListOptions> WordListOptions { get; set; } = new();
    public List<WordlistRules> WordlistRules { get; set; } = new(); 
    public List<WordlistWord> WordlistWords { get; set; } = new();  
}
