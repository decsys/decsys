using Decsys.Data.Entities;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Decsys.Repositories.Contracts
{
    public interface ISurveyRepository
    {
        //SurveyService
        Survey Get(int id);
        int Create(string? name = null);
        int Duplicate(int id);
        void Delete(int id);
        void EditName(int id, string name);
        void Configure(int id, Models.ConfigureSurveyModel config);


    }
}
 