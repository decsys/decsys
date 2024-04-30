using System.CommandLine;
using Decsys.Commands.Helpers;

namespace Decsys.Commands;

public class GenerateId : Command
{
    public GenerateId(string name)
        : base(name, "Generates a secure unique identifier in Base64Url format, suitable for use as a secret.")
    {
        var optHash = new Option<bool>(["-s", "--sha", "--hash"],
            "Also output a SHA256 hash of the ID in Base64Url format.");
        Add(optHash);

        this.SetHandler(
            (logger, console, hash) =>
            {
                this.ConfigureServices(s => s
                        .AddSingleton<ILoggerFactory>(_ => logger)
                        .AddSingleton<IConsole>(_ => console)
                        .AddTransient<Runners.GenerateId>())
                    .GetRequiredService<Runners.GenerateId>().Run(hash);
            },
            Bind.FromServiceProvider<ILoggerFactory>(),
            Bind.FromServiceProvider<IConsole>(),
            optHash);
    }
}
