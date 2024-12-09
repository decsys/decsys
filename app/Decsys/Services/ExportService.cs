using System.Runtime.CompilerServices;
using System.Threading.Tasks;

using Decsys.Repositories.Contracts;
using Decsys.Services.Contracts;

using Newtonsoft.Json;

using UoN.ZipBuilder;

namespace Decsys.Services
{
    public class ExportService
    {
        private readonly ISurveyRepository _surveys;
        private readonly SurveyInstanceService _instances;
        private readonly StudyAllocationService _studies;
        private readonly ParticipantEventService _events;
        private readonly IImageService _images;

        public ExportService(
            ISurveyRepository surveys,
            SurveyInstanceService instances,
            StudyAllocationService studies,
            ParticipantEventService events,
            IImageService images)
        {
            _surveys = surveys;
            _instances = instances;
            _studies = studies;
            _events = events;
            _images = images;
        }

        public async Task<byte[]> Structure(int surveyId)
        {
            var zip = await ExportStructure(surveyId);

            foreach (var child in _surveys.ListChildren(surveyId).Surveys)
            {
                zip.AddBytes(
                    (await ExportStructure(child.Id)).AsByteArray(),
                    $"{child.Id}.zip");
            }

            return zip.AsByteArray();
        }

        private async Task<ZipBuilder> ExportStructure(int surveyId)
        {
            var surveyData = _surveys.Find(surveyId);

            // start building the export zip
            var zipBuilder = new ZipBuilder()
                .CreateZipStream()
                .AddTextContent(
                    JsonConvert.SerializeObject(surveyData),
                    "structure.json");

            // if this survey has any images uploaded, add them
            foreach (var (filename, bytes) in await _images.ListSurveyImages(surveyId))
                zipBuilder = zipBuilder.AddBytes(bytes, $"images/{filename}");

            return zipBuilder;
        }

        public async Task<byte[]> Full(int surveyId)
        {
            // Get the structure zip contents (json and images)
            var zip = await ExportStructure(surveyId);

            // add full json exports for each instance
            foreach (var instance in _instances.List(surveyId))
            {
                var publishTimestamp = instance.Published.UtcDateTime.ToString("s").Replace(":", "_");
                var studyPrefix = instance.Survey.IsStudy ? "Study" : "";

                zip.AddTextContent(
                    instance.Survey.IsStudy
                        ? JsonConvert.SerializeObject(_studies.Export(instance.Id))
                        : JsonConvert.SerializeObject(_events.Results(instance.Id)),
                    $"{studyPrefix}Instance-{publishTimestamp}.json");
            }

            foreach (var child in _surveys.ListChildren(surveyId).Surveys)
                zip.AddBytes(await Full(child.Id), $"{child.Id}.zip");

            // return the zip data
            return zip.AsByteArray();
        }
    }
}
