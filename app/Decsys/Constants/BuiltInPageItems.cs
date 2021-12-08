namespace Decsys.Constants;

public record PageItemMetadata(string Type, string QuestionContent);

public static class BuiltInPageItems
{
    public const string Heading = "heading";
    public const string Paragraph = "paragraph";
    public const string Image = "image";
    public const string Spacer = "spacer";

    private static readonly Dictionary<string, PageItemMetadata> pageItems = new()
    {
        [Heading] = new(Heading, "text"),
        [Paragraph] = new(Paragraph, "text"),
        [Image] = new(Image, "questionContent"),
        [Spacer] = new(Spacer, "questionContent"),
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

