namespace Decsys.Config
{
    public class AppMode
    {
        public bool IsWorkshop { get; set; }

        public bool IsHosted => !IsWorkshop;
    }
}
