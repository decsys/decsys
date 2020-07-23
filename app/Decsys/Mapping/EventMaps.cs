using AutoMapper;
using Decsys.Data.Entities;

namespace Decsys.Mapping
{
    public class EventMaps : Profile
    {
        public EventMaps()
        {
            CreateMap<Models.ParticipantEvent, ParticipantEvent>()
                .ForMember(dest => dest.Payload,
                    opt => opt.ConvertUsing(new JObjectBsonConverter()));

            CreateMap<ParticipantEvent, Models.ParticipantEvent>()
                .ForMember(dest => dest.Payload,
                    opt => opt.ConvertUsing(new BsonJObjectConverter()));
        }
    }
}
