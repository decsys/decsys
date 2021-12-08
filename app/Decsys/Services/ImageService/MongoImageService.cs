using Decsys.Config;
using Decsys.Constants;
using Decsys.Repositories.Contracts;
using Decsys.Services.Contracts;

using Microsoft.Extensions.Options;

using MongoDB.Driver;
using MongoDB.Driver.GridFS;

namespace Decsys.Services
{
    public class MongoImageService : IImageService
    {
        private readonly IComponentRepository _components;
        private readonly IMongoDatabase _db;

        public MongoImageService(
            IOptions<HostedDbSettings> config,
            IMongoClient mongo,
            IComponentRepository components)
        {
            _db = mongo.GetDatabase(config.Value.DatabaseName);
            _components = components;
        }

        private IGridFSBucket ImageBucket(int surveyId)
            => new GridFSBucket(_db, new GridFSBucketOptions
            {
                BucketName = $"{Collections.Images}{surveyId}"
            });

        private static string GetImageFilename(Guid componentId, string extension)
            => $"{componentId}{extension}";

        public async Task<List<(string filename, byte[] bytes)>> ListSurveyImages(int surveyId)
        {
            List<(string filename, byte[] bytes)> images = new();
            var files = await Enumerate(surveyId);

            foreach (var filename in files)
            {
                var bytes = await ImageBucket(surveyId).DownloadAsBytesByNameAsync(filename);
                images.Add((filename, bytes));
            }

            return images;
        }

        public async Task<byte[]> GetImage(int surveyId, string filename)
            => await ImageBucket(surveyId)
                .DownloadAsBytesByNameAsync(filename);

        public async Task<byte[]> GetImage(int surveyId, Guid componentId, string extension)
            => await GetImage(surveyId, GetImageFilename(componentId, extension));

        public async Task StoreImage(int surveyId, Guid componentId, (string extension, byte[] bytes) file)
            => await ImageBucket(surveyId).UploadFromBytesAsync(
                GetImageFilename(componentId, file.extension),
                file.bytes);

        public async Task RemoveImage(int surveyId, Guid pageId, Guid componentId)
        {
            var extension = GetStoredFileExtension(surveyId, pageId, componentId);
            if (extension is null) return; // no image currently stored; job done

            var bucket = ImageBucket(surveyId);

            // get the id of the latest revision of this image by filename
            using var cursor = await bucket.FindAsync(
                Builders<GridFSFileInfo>.Filter.Eq(
                    x => x.Filename,
                    GetImageFilename(componentId, extension)),
                new GridFSFindOptions
                {
                    Limit = 1,
                    Sort = Builders<GridFSFileInfo>.Sort.Descending(x => x.UploadDateTime)
                });

            var id = (await cursor.ToListAsync()).FirstOrDefault()?.Id;
            if (id is null) return;

            await bucket.DeleteAsync(id.Value);
        }

        public async Task RemoveAllSurveyImages(int id)
            => await ImageBucket(id).DropAsync();

        public async Task CopyImage(int surveyId, Guid pageId, Guid srcId, Guid destId)
        {
            var extension = GetStoredFileExtension(surveyId, pageId, srcId);
            if (extension is null) return; // For whatever reason, an image item with no image has been duplicated

            var bytes = await GetImage(surveyId, srcId, extension);

            await StoreImage(surveyId, destId, (extension, bytes));
        }

        public async Task CopyAllSurveyImages(int oldId, int newId)
        {
            var srcFiles = await Enumerate(oldId);

            foreach (var filename in srcFiles)
            {
                var bytes = await ImageBucket(oldId).DownloadAsBytesByNameAsync(filename);
                await ImageBucket(newId).UploadFromBytesAsync(filename, bytes);
            }
        }

        public async Task Import(int id, List<(string filename, byte[] data)> images)
        {
            foreach (var (filename, data) in images)
                await ImageBucket(id).UploadFromBytesAsync(filename, data);
        }

        public async Task<IEnumerable<string>> Enumerate(int surveyId)
        {
            using var cursor = await ImageBucket(surveyId).FindAsync(Builders<GridFSFileInfo>.Filter.Empty);
            return (await cursor.ToListAsync()).Select(x => x.Filename).Distinct();
        }

        public async Task<bool> HasImages(int surveyId)
            => await (await ImageBucket(surveyId)
                    .FindAsync(Builders<GridFSFileInfo>.Filter.Empty))
                .AnyAsync();

        private string? GetStoredFileExtension(int surveyId, Guid pageId, Guid componentId) =>
            _components.Find(surveyId, pageId, componentId)
                .Params.Value<string>("extension");
    }
}
