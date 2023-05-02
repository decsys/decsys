using AutoMapper;
using Decsys.Data.Entities.Mongo;
using Decsys.Models.Webhooks;
using Decsys.Repositories.Contracts;
using MongoDB.Driver;

namespace Decsys.Repositories.Mongo;

public class WebhookRepository : IWebhookRepository
{
    private readonly IMongoCollection<Webhook> _webhooks;
    private readonly IMapper _mapper;
    
    public WebhookRepository(
        IMongoCollection<Webhook> webhooks,
        IMapper mapper
        )
    {
        _webhooks = webhooks;
        _mapper = mapper;
    }
    
    public int Create(WebhookModel webhook)
    {
        var entity = _mapper.Map<Webhook>(webhook);
        
        _webhooks.InsertOne(entity);

        return entity.Id;
    }
}
