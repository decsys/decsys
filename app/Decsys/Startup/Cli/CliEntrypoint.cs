using System.CommandLine;
namespace Decsys.Startup.Cli;

public class CliEntrypoint : RootCommand
{
    public CliEntrypoint() : base("Decsys CLI")
    {
        AddGlobalOption(new Option<string>(new []{"--environment", "-e"}));
        
        // Add Commands here
    }
    
}
