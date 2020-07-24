using Decsys.Models;
using LiteDB;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Decsys.Repositories.Contracts
{
    interface IParticipantEventRepository
    {
        string GetCollectionName(string participantId, LiteDatabase db);
        string GetCollectionName(int instanceId, string participantId);
        string GetParticipantId(int instanceId, string participantId);
        IEnumerable<ParticipantEvent>_List(int instanceId, string participantId);
        string GetNextId(string participantId, int instanceId);
        IEnumerable<ParticipantEvent> List(int instanceId, string participantId);
        SurveyInstanceResults<ParticipantEvents> Results(int instanceId);
        void Log(int instanceId, string participantId, ParticipantEvent e);

        ParticipantEvent Last(int instanceId, string participantId, string source, string type);
        ParticipantEvent Last(int instanceId, string participantId, string type);
        SurveyInstanceResults<ParticipantResultsSummary> ResultsSummary(int instanceId);
        List<string> GetAllParticipantLogs(int instanceId);

        ParticipantResultsSummary ResultsSummary(int instanceId, string participantId);
        ParticipantResultsSummary ParticipantResultsSummary(SurveyInstance instance, string participantId);

    }
}
