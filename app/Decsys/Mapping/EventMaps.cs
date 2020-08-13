using AutoMapper;
using Decsys.Models;

namespace Decsys.Mapping
{
    public class EventMaps : Profile
    {
        public EventMaps()
        {
            CreateMap<ParticipantEvent, Data.Entities.LiteDb.ParticipantEvent>()
                .ForMember(dest => dest.Payload,
                    opt => opt.ConvertUsing(new JObjectBsonConverter()));

            CreateMap<Data.Entities.LiteDb.ParticipantEvent, ParticipantEvent>()
                .ForMember(dest => dest.Payload,
                    opt => opt.ConvertUsing(new BsonJObjectConverter()));

            CreateMap<ParticipantEvent, Data.Entities.Mongo.ParticipantEvent>();
            // TODO: does this work?
            //.ForMember(dest => dest.Payload,
            //    opt => opt.ConvertUsing(new JObjectBsonConverter()));

            CreateMap<Data.Entities.Mongo.ParticipantEvent, ParticipantEvent>();
            // TODO: does this work?
            //.ForMember(dest => dest.Payload,
            //    opt => opt.ConvertUsing(new BsonJObjectConverter()));
        }
    }
}
