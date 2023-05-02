using AutoMapper;
using Decsys.Models.Webhooks;

namespace Decsys.Mapping;

public class WebhookMap : Profile
{
    public WebhookMap()
    {
        CreateMap<Data.Entities.Mongo.Webhook, WebhookModel>();
    }
}
