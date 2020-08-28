using Newtonsoft.Json;
using UoN.ZipBuilder;

namespace Decsys.Services
{
    public class ExportService
    {
        private readonly SurveyService _surveys;
        private readonly SurveyInstanceService _instances;
        private readonly ParticipantEventService _events;
        private readonly LocalFileImageService _images;

        public ExportService(
            SurveyService surveys,
            SurveyInstanceService instances,
            ParticipantEventService events,
            LocalFileImageService images)
        {
            _surveys = surveys;
            _instances = instances;
            _events = events;
            _images = images;
        }

        public byte[] Structure(int surveyId)
            => ExportStructure(surveyId).AsByteArray();


        private ZipBuilder ExportStructure(int surveyId)
        {
            var surveyData = _surveys.Get(surveyId);

            // start building the export zip
            var zipBuilder = new ZipBuilder()
                .CreateZipStream()
                .AddTextContent(
                    JsonConvert.SerializeObject(surveyData),
                    "structure.json");

            // if this survey has any images uploaded, add them
            // TODO: fix
            //if (await _images.HasImages(surveyId))
            //    zipBuilder = zipBuilder.AddDirectoryShallow(
            //        _images.SurveyImagesPath(surveyId), "images");

            return zipBuilder;
        }

        public byte[] Full(int surveyId)
        {
            // Get the structure zip contents (json and images)
            var zip = ExportStructure(surveyId);

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
