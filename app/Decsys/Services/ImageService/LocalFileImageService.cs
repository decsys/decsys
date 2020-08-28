using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

using Decsys.Repositories.Contracts;
using Decsys.Services.Contracts;

namespace Decsys.Services
{
    public class LocalFileImageService : IImageService
    {
        private readonly IComponentRepository _components;

        private readonly string _imagesPath;

        public LocalFileImageService(string imagesPath, IComponentRepository components)
        {
            _imagesPath = imagesPath;
            _components = components;
        }

        private string GetImageFilename(Guid componentId, string extension)
            => $"{componentId}{extension}";

        private string SurveyImagesPath(int id) =>
            Path.Combine(_imagesPath, id.ToString());

        public async Task StoreImage(int surveyId, Guid componentId, (string extension, byte[] bytes) file)
        {
            var dir = SurveyImagesPath(surveyId);

            if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);

            var path = Path.Combine(dir, GetImageFilename(componentId, file.extension));

            using var stream = File.Create(path);
            await stream.WriteAsync(file.bytes, 0, file.bytes.Length);
        }

        public Task RemoveImage(int surveyId, Guid pageId, Guid componentId)
        {
            var extension = GetStoredFileExtension(surveyId, pageId, componentId);
            if (extension is null) return Task.CompletedTask; // no image currently stored; job done

            var path = Path.Combine(
                SurveyImagesPath(surveyId),
                GetImageFilename(componentId, extension));

            if (File.Exists(path)) File.Delete(path);

            return Task.CompletedTask;
        }

        public Task RemoveAllSurveyImages(int id)
        {
            var path = SurveyImagesPath(id);

            if (!Directory.Exists(path)) return Task.CompletedTask;

            Directory.Delete(path, true);

            return Task.CompletedTask;
        }

        public Task CopyImage(int surveyId, Guid pageId, Guid srcId, Guid destId)
        {
            var extension = GetStoredFileExtension(surveyId, pageId, srcId);
            if (extension is null) return Task.CompletedTask; // For whatever reason, an image item with no image has been duplicated

            var path = Path.Combine(
                SurveyImagesPath(surveyId), srcId.ToString() + extension);

            if (File.Exists(path))
            {
                File.Copy(path, Path.Combine(
                SurveyImagesPath(surveyId), destId.ToString() + extension));
            }

            return Task.CompletedTask;
        }

        public async Task CopyAllSurveyImages(int oldId, int newId)
        {
            var dest = SurveyImagesPath(newId); ;

            Directory.CreateDirectory(dest);
            foreach (var f in await Enumerate(oldId))
                File.Copy(f, Path.Combine(dest, Path.GetFileName(f)));
        }

        public async Task Import(int id, List<(string filename, byte[] data)> images)
        {
            var dest = SurveyImagesPath(id);

            Directory.CreateDirectory(dest);
            foreach (var (filename, data) in images)
            {
                using var stream = File.Create(Path.Combine(dest, filename));
                await stream.WriteAsync(data.AsMemory(0, data.Length)).ConfigureAwait(false);
            }
        }

        public Task<IEnumerable<string>> Enumerate(int surveyId)
        {
            var dir = SurveyImagesPath(surveyId);
            var result = Directory.Exists(dir)
                ? Directory.EnumerateFiles(dir)
                : new List<string>();
            return Task.FromResult(result);
        }

        public async Task<bool> HasImages(int surveyId)
            => (await Enumerate(surveyId)).Any();

        private string GetStoredFileExtension(int surveyId, Guid pageId, Guid componentId) =>
            _components.Find(surveyId, pageId, componentId)
                .Params.Value<string>("extension");

        public async Task<byte[]> GetImage(int surveyId, string filename)
        => await File.ReadAllBytesAsync(
                    Path.Combine(
                        SurveyImagesPath(surveyId),
                        filename));

        public async Task<byte[]> GetImage(int surveyId, Guid componentId, string extension)
            => await GetImage(surveyId, GetImageFilename(componentId, extension));


        public async Task<List<(string filename, byte[] bytes)>> ListSurveyImages(int surveyId)
        {
            List<(string filename, byte[] bytes)> images = new();
            var files = await Enumerate(surveyId);

            foreach (var filename in files)
            {
                var bytes = await File.ReadAllBytesAsync(
                    Path.Combine(SurveyImagesPath(surveyId), filename));
                images.Add((filename, bytes));
            }

            return images;
        }
    }
}
