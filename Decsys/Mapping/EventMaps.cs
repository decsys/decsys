using AutoMapper;
using Decsys.Data.Entities;
using LiteDB;
using Newtonsoft.Json.Linq;

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
                    opt => opt.MapFrom(
                        src => JObject.Parse(
                            JsonSerializer.Serialize(
                                src.Payload,
                                false,
                                false)))); // TODO: make this less dumb?
        }
    }
}
