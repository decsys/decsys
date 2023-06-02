using System.CommandLine;
using Decsys.Commands.Helpers;

namespace Decsys.Commands;

public class Hash : Command
{
    public Hash(string name) : base(name, "Hash a string input (such as a secret)")
    {
        var argInput = new Argument<string>("input", "The input string to hash");
        Add(argInput);

        this.SetHandler((logger, console, input) =>
            {
                this
                    .ConfigureServices((s) =>
                        ServiceCollectionServiceExtensions.AddSingleton<ILoggerFactory>(s, _ => logger)
                            .AddSingleton<IConsole>(_ => console)
                            .AddTransient<Runners.Hash>()
                    )
                    .GetRequiredService<Runners.Hash>()
                    .Run(input);
            },
            Bind.FromServiceProvider<ILoggerFactory>(),
            Bind.FromServiceProvider<IConsole>(),
            argInput);
    }
    
}
