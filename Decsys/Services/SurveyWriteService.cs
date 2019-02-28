using AutoMapper;
using Decsys.Data.Entities;
using Decsys.Models;
using LiteDB;

namespace Decsys.Services
{
    public class SurveyWriteService
    {
        private readonly LiteDatabase _db;

        public SurveyWriteService(LiteDatabase db)
        {
            _db = db;
        }

        /// <summary>
        /// Creates a Survey with the provided name (or the default one).
        /// </summary>
        /// <param name="name">The name to give the new Survey.</param>
        /// <returns>The ID of the newly created Survey.</returns>
        public int Create(string name = null)
            => _db.GetCollection<Survey>("Surveys")
                .Insert(name is null ? new Survey() : new Survey
                {
                    Name = name
                });
    }
}
