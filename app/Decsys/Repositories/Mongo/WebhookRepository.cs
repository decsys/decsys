using AutoMapper;
using Decsys.Models.Webhooks;
using Decsys.Repositories.Contracts;
using MongoDB.Driver;

namespace Decsys.Repositories.Mongo;

public class WebhookRepository : IWebhookRepository
{
    private readonly IMongoCollection<WebhookModel> _webhooks;
    private readonly IMapper _mapper;
    
    public WebhookRepository(
        IMongoCollection<WebhookModel> webhooks,
        IMapper mapper
        )
    {
        _webhooks = webhooks;
        _mapper = mapper;
    }
    
    public WebhookModel Create(WebhookModel webhook)
    {
        var entity = _mapper.Map<WebhookModel>(webhook);

        return entity;
    }
}
