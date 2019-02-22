namespace Decsys.Data.Entities
{
    public class Survey
    {
        public int Id { get; set; }

        public string Name { get; set; } = "Untitled Survey";

        public int RunCount { get; set; }

        public bool Active { get; set; } // TODO: don't store this, calculate it from Active Sessions
    }
}
