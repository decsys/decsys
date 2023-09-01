namespace Decsys.Utilities;

public static class FriendlyIds
{
    private const int Offset = 10;
    private const string Separator = "z";
    private static readonly char[] CustomBaseChars =
        "0123456789abcdefghijklmnopqrstuvwxy".ToCharArray();


    // Helper function to encode a single ID
    private static string EncodeId(int n)
    {
        int adjusted = n + Offset;
        return BaseConvert.ToBase(adjusted, CustomBaseChars);
    }

    // Helper function to decode a single ID
    private static int DecodeId(string id)
    {
        long decodedValue = BaseConvert.FromBase(id, CustomBaseChars);
        return (int)decodedValue - Offset;
    }

    public static string Encode(int surveyId, int? instanceId = null)
    {
        return instanceId == null
            ? EncodeId(surveyId)
            : $"{EncodeId(surveyId)}{Separator}{EncodeId(instanceId.Value)}";
    }

    public static (int surveyId, int instanceId) Decode(string id)
    {
        var parts = id.Split(Separator).Select(DecodeId).ToArray();

        return (parts[0], parts[1]);
    }

}
