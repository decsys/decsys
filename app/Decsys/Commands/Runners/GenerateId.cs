using System.CommandLine;
using ConsoleTableExt;
using IdentityModel;

namespace Decsys.Commands.Runners;

internal class GenerateId
{
    private readonly IConsole _console;
    private readonly ILogger<GenerateId> _logger;

    public GenerateId(
        ILoggerFactory logger, IConsole console)
    {
        _console = console;
        _logger = logger.CreateLogger<GenerateId>();
    }

    public void Run(bool hash = false)
    {
        const CryptoRandom.OutputFormat outputFormat = CryptoRandom.OutputFormat.Base64Url;

        var outputRows = new List<List<object>>();

        // Generate the ID
        _logger.LogInformation(
            $"Generating as {{{nameof(outputFormat)}}}",
            outputFormat);

        var id = Crypto.GenerateId(32, outputFormat);

        outputRows.Add(new() { "ID", id });

        // Generate the Hash
        if (hash)
        {
            _logger.LogInformation(
                "Hashing with SHA256 as {hashFormat}",
                CryptoRandom.OutputFormat.Base64Url);

            outputRows.Add(new() { "SHA256", id.Sha256() });
        }

        // Output
        _console.Out.Write(ConsoleTableBuilder
            .From(outputRows)
            .WithCharMapDefinition(CharMapDefinition.FramePipDefinition)
            .Export()
            .ToString());
    }
}
