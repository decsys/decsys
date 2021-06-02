using Decsys.ModelBinding;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Decsys.Models
{
    [ModelBinder(typeof(MultiPartJsonModelBinder), Name = "json")]
    public class ImportSurveyModel : CreateSurveyModel
    {
        public IFormFile? File { get; set; }
    }
}
