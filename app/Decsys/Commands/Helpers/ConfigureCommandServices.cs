using System.CommandLine;

namespace Decsys.Commands.Helpers;

public static class ConfigureCommandServices
{
    /// <summary>
    /// Specify DI Services configuration then build a service provider from that configuration.
    /// 
    /// Approximately similar interface to the standard .NET Hosting Model's ConfigureServices()
    /// </summary>
    /// <param name="_"></param>
    /// <param name="configure">The configuration action</param>
    /// <returns></returns>
    public static IServiceProvider ConfigureServices(this Command _, Action<IServiceCollection> configure)
    {
        var s = new ServiceCollection();
        configure.Invoke(s);
        return s.BuildServiceProvider();
    }
}
