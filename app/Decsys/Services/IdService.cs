using Decsys.Utilities;

namespace Decsys.Services;

public class IdService
{
    private const int OFFSET = 10;
    private const char SEPARATOR = 'z';

    // Helper function to encode a single ID
    private string EncodeId(int n)
    {
        int adjusted = n + OFFSET;
        return BaseConvert.ToBase(adjusted, 35); 
    }

    // Helper function to decode a single ID
    private int DecodeId(string id)
    {
        long decodedValue = BaseConvert.FromBase(id, 35); 
        return (int)decodedValue - OFFSET;
    }

    public string Encode(int surveyId, int? instanceId = null)
    {
        return instanceId == null
            ? EncodeId(surveyId)
            : $"{EncodeId(surveyId)}{SEPARATOR}{EncodeId(instanceId.Value)}";
    }

    public List<int> Decode(string id)
    {
              return id.Split(SEPARATOR).Select(DecodeId).ToList();
    }
}
