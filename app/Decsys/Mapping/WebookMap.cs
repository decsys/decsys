using AutoMapper;
using Decsys.Models.Webhooks;

namespace Decsys.Mapping;

public class WebookMap : Profile
{
    public WebookMap()
    {
        CreateMap<Data.Entities.Mongo.Webhook, WebhookModel>();
    }
}
