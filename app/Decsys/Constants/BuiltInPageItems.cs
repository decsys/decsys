namespace Decsys.Constants;

public record PageItemMetadata(string Type, string QuestionContent);

public static class BuiltInPageItems
{
    private static readonly Dictionary<string, PageItemMetadata> pageItems = new()
    {
        ["heading"] = new("heading", "text"),
        ["paragraph"] = new("paragraph", "text"),
        ["image"] = new("image", "questionContent"),
        ["spacer"] = new("spacer", "questionContent"),
    };

    /// <summary>
    /// Determine if the specified Page Item type is a built-in type the backend is aware of
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    public static bool IsBuiltIn(string type) => pageItems.ContainsKey(type);

    /// <summary>
    /// Get the metadata for a built in type, or null
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    public static PageItemMetadata? Metadata(string type) => pageItems[type];
}

