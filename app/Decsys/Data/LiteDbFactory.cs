
using Decsys.Constants;
using Decsys.Services.Contracts;

using LiteDB;

namespace Decsys.Data
{
    /// <summary>
    /// Instantiate connections for LiteDb databases on request and manages their lifetimes
    /// </summary>
    public class LiteDbFactory : IDisposable
    {
        private readonly string _localDbPath;

        public LiteDbFactory(ILocalPathsProvider paths)
        {
            _localDbPath = paths.Databases;
        }

        private const string SurveysFile = "user-surveys.db";

        private static string InstanceEventLogsFile(int instanceId)
            => $"{Collections.InstanceDb}{instanceId}.db";

        private string AbsoluteFilePath(string file)
            => Path.Combine(_localDbPath, file);

        private string BuildConnectionString(string file)
            => $"Filename={AbsoluteFilePath(file)};Connection=direct;";

        private readonly IDictionary<string, LiteDatabase> _connections = new Dictionary<string, LiteDatabase>();

        private LiteDatabase Connect(string connectionString)
        {
            if (!_connections.ContainsKey(connectionString))
            {
                _connections[connectionString] = new LiteDatabase(connectionString)
                {
                    CheckpointSize = 1
                };
            }
            return _connections[connectionString];
        }

        private void CloseConnection(string connectionString)
        {
            var connection = _connections[connectionString];
            _connections.Remove(connectionString);
            connection.Commit();
            connection.Dispose();
        }

        public void Drop(string filename)
        {
            CloseConnection(BuildConnectionString(filename));
            File.Delete(AbsoluteFilePath(filename));
        }

        public void DropInstanceEventLog(int instanceId)
            => Drop(InstanceEventLogsFile(instanceId));

        public LiteDatabase Surveys => Connect(BuildConnectionString(SurveysFile));

        public LiteDatabase InstanceEventLogs(int instanceId)
            => Connect(BuildConnectionString(InstanceEventLogsFile(instanceId)));

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool managed)
        {
            if (managed)
                foreach (var connection in _connections.Keys)
                    CloseConnection(connection);
        }
    }
}
