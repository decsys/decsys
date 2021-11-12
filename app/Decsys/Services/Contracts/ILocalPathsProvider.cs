namespace Decsys.Services.Contracts
{
    public interface ILocalPathsProvider
    {
        string Databases { get; }

        string SurveyImages { get; }
    }
}
