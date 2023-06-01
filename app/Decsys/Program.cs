using System.CommandLine.Builder;
using System.CommandLine.Parsing;
using Decsys.Commands.Directory;
using Decsys.Startup.Cli;
using Decsys.Startup.Web;

// Global App Startup stuff here

// Initialise the command line parser and run the appropriate entrypoint
await new CommandLineBuilder(new CliEntrypoint())
    .UseDefaults()
    .UseRootCommandBypass(args, WebEntrypoint.Run)
    .UseCliHostDefaults(args)
    .Build()
    .InvokeAsync(args);
    
