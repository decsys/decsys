using Decsys.Models;
using Decsys.Services;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Decsys.Repositories.Contracts
{
    public interface ISurveyRepository
    {

        Survey Get(int id);
        IEnumerable<SurveySummary> List();
        int Create(string? name = null);
        int Import(Survey survey);
        void Delete(int id);
        void EditName(int id, string name);
        void Update(Survey survey);


    }
}
 