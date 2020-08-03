using Decsys.Models;

using LiteDB;

using System.Collections.Generic;

namespace Decsys.Repositories.Contracts
{
    interface IParticipantEventRepository
    {
        string GetCollectionName(string participantId, LiteDatabase db);
        string GetCollectionName(int instanceId, string participantId);
        string GetParticipantId(int instanceId, string participantId);
        string GetNextId(string participantId, int instanceId);
        IEnumerable<Models.ParticipantEvent> List(int instanceId, string participantId);
        SurveyInstanceResults<ParticipantEvents> Results(int instanceId);
        void Log(int instanceId, string participantId, Models.ParticipantEvent e);

        Models.ParticipantEvent Last(int instanceId, string participantId, string source, string type);
        Models.ParticipantEvent Last(int instanceId, string participantId, string type);
        SurveyInstanceResults<ParticipantResultsSummary> ResultsSummary(int instanceId);
        List<string> GetAllParticipantLogs(int instanceId);

        ParticipantResultsSummary ResultsSummary(int instanceId, string participantId);
        ParticipantResultsSummary ParticipantResultsSummary(Data.Entities.SurveyInstance instance, string participantId);

    }
}

