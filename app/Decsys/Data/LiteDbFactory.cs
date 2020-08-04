using System;
using System.Collections.Generic;
using System.IO;

using LiteDB;

namespace Decsys.Data
{
    /// <summary>
    /// Instantiate connections for LiteDb databases on request and manages their lifetimes
    /// </summary>
    public class LiteDbFactory : IDisposable
    {
        private readonly string _localDbPath;

        public LiteDbFactory(string localDbPath)
        {
            _localDbPath = localDbPath;
        }

        private const string SurveysFile = "user-surveys.db";

        private static string InstanceEventLogsFile(int instanceId)
            => $"{Collections.EventLogDb}{instanceId}.db";

        private string BuildConnectionString(string file)
            => $"Filename={Path.Combine(_localDbPath, file)};Connection=direct;";

        private IDictionary<string, LiteDatabase> _connections = new Dictionary<string, LiteDatabase>();

        private LiteDatabase Connect(string connectionString)
        {
            if (!_connections.ContainsKey(connectionString))
                _connections[connectionString] = new LiteDatabase(connectionString);
            return _connections[connectionString];
        }

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
                foreach (var db in _connections.Values)
                    db.Dispose();
        }
    }
}
