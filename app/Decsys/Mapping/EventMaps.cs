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
                    opt => opt.ConvertUsing(new JObjectLiteDbBsonConverter()));

            CreateMap<Data.Entities.LiteDb.ParticipantEvent, ParticipantEvent>()
                .ForMember(dest => dest.Payload,
                    opt => opt.ConvertUsing(new LiteDbBsonJObjectConverter()));

            CreateMap<ParticipantEvent, Data.Entities.Mongo.ParticipantEvent>()
               .ForMember(dest => dest.Payload,
                   opt => opt.ConvertUsing(new JObjectMongoBsonConverter()));

            CreateMap<Data.Entities.Mongo.ParticipantEvent, ParticipantEvent>()
               .ForMember(dest => dest.Payload,
                   opt => opt.ConvertUsing(new MongoBsonJObjectConverter()));
        }
    }
}
