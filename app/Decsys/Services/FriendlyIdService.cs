using Decsys.Utilities;

namespace Decsys.Services;

public class FriendlyIdService
{
    private const int Offset = 10;
    private const string Separator = "z";
    private static readonly char[] CustomBaseChars = 
        "0123456789abcdefghijklmnopqrstuvwxy".ToCharArray();


    // Helper function to encode a single ID
    private string EncodeId(int n)
    {
        int adjusted = n + Offset;
        return BaseConvert.ToBase(adjusted, CustomBaseChars); 
    }

    // Helper function to decode a single ID
    private int DecodeId(string id)
    {
        long decodedValue = BaseConvert.FromBase(id, CustomBaseChars); 
        return (int)decodedValue - Offset;
    }

    public string Encode(int surveyId, int? instanceId = null)
    {
        return instanceId == null
            ? EncodeId(surveyId)
            : $"{EncodeId(surveyId)}{Separator}{EncodeId(instanceId.Value)}";
    }

    public List<int> Decode(string id)
    {

             return id.Split(Separator).Select(DecodeId).ToList();
    }
}
