using Decsys.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Decsys.Repositories.Contracts
{
    interface ISurveyInstanceRepository
    {
        int Create(int surveyId);
        SurveyInstance Get(int surveyId, int instanceId);
        IEnumerable<SurveyInstance> List(int surveyId);
        void Close(int surveyId, int instanceId);

        void Import(IList<SurveyInstanceResults<ParticipantEvents>> instanceModels, int targetSurveyId);
    }
}
