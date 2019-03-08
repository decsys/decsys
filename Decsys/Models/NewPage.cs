namespace Decsys.Models
{
    public class NewPage
    {
        public NewPage(string type)
        {
            Type = type;
        }

        public int Order { get; set; }

        public string Type { get; set; }
    }
}