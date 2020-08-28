using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Decsys.Services.Contracts;
using Newtonsoft.Json;
using UoN.ZipBuilder;

namespace Decsys.Services
{
    public class ExportService
    {
        private readonly SurveyService _surveys;
        private readonly SurveyInstanceService _instances;
        private readonly ParticipantEventService _events;
        private readonly IImageService _images;

        public ExportService(
            SurveyService surveys,
            SurveyInstanceService instances,
            ParticipantEventService events,
            IImageService images)
        {
            _surveys = surveys;
            _instances = instances;
            _events = events;
            _images = images;
        }

        public async Task<byte[]> Structure(int surveyId)
            => (await ExportStructure(surveyId)).AsByteArray();

        private async Task<ZipBuilder> ExportStructure(int surveyId)
        {
            var surveyData = _surveys.Get(surveyId);

            // start building the export zip
            var zipBuilder = new ZipBuilder()
                .CreateZipStream()
                .AddTextContent(
                    JsonConvert.SerializeObject(surveyData),
                    "structure.json");

            // if this survey has any images uploaded, add them
            foreach(var (filename, bytes) in await _images.ListSurveyImages(surveyId))
                zipBuilder = zipBuilder.AddBytes(bytes, filename);

            return zipBuilder;
        }

        public async Task<byte[]> Full(int surveyId)
        {
            // Get the structure zip contents (json and images)
            var zip = await ExportStructure(surveyId);

            // add full json exports for each instance
            foreach (var instance in _instances.List(surveyId))
            {
                zip.AddTextContent(
                      JsonConvert.SerializeObject(_events.Results(instance.Id)),
                      $"Instance-{instance.Published.UtcDateTime.ToString("s").Replace(":", "_")}.json");
            }

            // return the zip data
            return zip.AsByteArray();
        }
    }
}
