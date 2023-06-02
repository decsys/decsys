using System.CommandLine;
using Decsys.Commands;

namespace Decsys.Startup.Cli;

public class CliEntrypoint : RootCommand
{
    public CliEntrypoint() : base("Decsys CLI")
    {
        AddGlobalOption(new Option<string>(new []{"--environment", "-e"}));
        
        // Add Commands here
        
        AddCommand(new Command("crypto", "Actions for working with secure identifiers")
        {
            new GenerateId("generate-id"),
            new Hash("hash")
        });
    }
    
}
