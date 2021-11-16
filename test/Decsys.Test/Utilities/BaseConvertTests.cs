using Decsys.Utilities;

using System.Collections.Generic;

using Xunit;
using Xunit.Abstractions;

namespace Decsys.Test.Utilities
{
    public class BaseConvertTests
    {
        private readonly ITestOutputHelper _output;

        public BaseConvertTests(ITestOutputHelper output)
        {
            _output = output;
        }

        [Theory]
        [InlineData(0, "A")]
        [InlineData(1, "B")]
        [InlineData(25, "Z")]
        [InlineData(26, "AA")]
        [InlineData(27, "AB")]
        [InlineData(51, "AZ")]
        [InlineData(52, "BA")]
        [InlineData(53, "BB")]
        [InlineData(26 * 27-1, "ZZ")]
        [InlineData(26 * 27, "AAA")]
        public void ToBijectiveHexavigesimal_IncrementsCorrectly(int value, string expected)
        {
            var actual = BaseConvert.ToBijectiveHexavigesimal(value);

            _output.WriteLine($"expected: {expected}");
            _output.WriteLine($"actual: {actual}");

            Assert.Equal(expected, actual);
        }

        [Fact]
        public void ToBijectiveHexavigesimal_AcceptsIntMax()
        {
            var result = BaseConvert.ToBijectiveHexavigesimal(int.MaxValue);

            _output.WriteLine($"result: {result}");

            Assert.NotNull(result);
        }

        [Fact]
        public void ToBijectiveHexavigesimal_SampleOutput()
        {
            List<string> result = new();
            for(var i = 0; i < 26*28; i++)
                result.Add(BaseConvert.ToBijectiveHexavigesimal(i));

            Assert.NotNull(result);
        }
    }
}
