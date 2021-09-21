using Decsys.Constants;

namespace Decsys.Data.Entities
{
    public class BaseRandomisationStrategy
    {
        public string Strategy { get; set; } = RandomisationStrategies.Hybrid;
    }

}
