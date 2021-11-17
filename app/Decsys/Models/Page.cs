namespace Decsys.Models
{
    public class Page
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Name { get; set; } = string.Empty;

        public int Order { get; set; }

        public List<Component> Components { get; set; } = new List<Component>();

        public bool Randomize { get; set; }
    }
}
