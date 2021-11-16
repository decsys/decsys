using System.Text;

namespace Decsys.Utilities
{
    public static class BaseConvert
    {
        private static readonly char[] AlphaBaseChars =
         "ABCDEFGHIJKLMNOPQRSTUVWXYZ".ToCharArray();

        // Bijective Alpha Base26 is ported from here:
        // https://stackoverflow.com/a/56051503

        public static string ToBijectiveHexavigesimal(long n)
        {
            if (n < AlphaBaseChars.Length) return AlphaBaseChars[n].ToString();
            else return ToBijectiveHexavigesimal((long)Math.Floor((double)n / AlphaBaseChars.Length - 1)) + AlphaBaseChars[n % AlphaBaseChars.Length];

            //var mod = value % 26;
            //var n = ToBase(mod, AlphaBaseChars); // Convert to Alpha Base 26

            //// if greater than 26, recursively convert the higher powers
            //if (value > 26) return ToBijectiveHexavigesimal((long)Math.Floor((value - 1f) / 26)) + n;
            //else return n;
        }

        // All the generic stuff below is from here:
        // https://stackoverflow.com/a/35004409

        // We keep standard Base62 maps prepared statically
        private static readonly char[] BaseChars =
         "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".ToCharArray(); // TODO: Add up to standard Base64?
        private static readonly Dictionary<char, int> ReverseBaseChars = ReverseCharMap(BaseChars);

        /// <summary>
        /// Low level generic base converter, uses a provided character map.
        /// the target base is determined from the character map
        /// </summary>
        /// <param name="value"></param>
        /// <param name="charMap"></param>
        /// <returns></returns>
        public static string ToBase(long value, char[] charMap)
        {
            long targetBase = charMap.Length;
            // Determine exact number of characters to use.
            char[] buffer = new char[Math.Max(
                       (int)Math.Ceiling(Math.Log(value + 1, targetBase)), 1)];

            var i = buffer.Length;
            do
            {
                buffer[--i] = charMap[value % targetBase];
                value = value / targetBase;
            }
            while (value > 0);

            return new string(buffer, i, buffer.Length - i);
        }

        /// <summary>
        /// <para>
        /// A generic standard base converter that works up to Base62.
        /// </para>
        ///
        /// <para>
        /// Uses a standard mapping: `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`
        /// truncated for smaller bases
        /// </para>
        /// </summary>
        /// <param name="value"></param>
        /// <param name="targetBase"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentException">If a base is requested that's higher than possible using the standard mapping</exception>
        public static string ToBase(long value, int targetBase)
        {
            if (targetBase < 1 || targetBase > BaseChars.Length)
                throw new ArgumentException(
                    $"The target base must be a positive integer that doesn't exceed {BaseChars.Length}",
                    nameof(targetBase));

            return ToBase(value, BaseChars.Take(targetBase).ToArray());
        }

        /// <summary>
        /// Precalculate a reverse character map to use in a base conversion
        /// </summary>
        /// <param name="charMap"></param>
        /// <returns></returns>
        public static Dictionary<char, int> ReverseCharMap(char[] charMap)
            => charMap.Select((c, i) => new { Char = c, Index = i })
                .ToDictionary(c => c.Char, c => c.Index);

        /// <summary>
        /// <para>
        /// Low level generic base parser, uses a provided character map
        /// (and optionally a precalculated reverse map for efficiency).
        /// </para>
        ///
        /// <para>
        /// If no reverse map is provided, one is calculated, (at reduced performance for repeated calls).
        /// </para>
        /// 
        /// <para>
        /// A reverse map can be precalculated using <see cref="ReverseCharMap(char[])"/>
        /// </para>
        /// </summary>
        /// <param name="number"></param>
        /// <param name="charMap"></param>
        /// <param name="reverseMap"></param>
        /// <returns></returns>
        public static long FromBase(string number, char[] charMap, Dictionary<char, int>? reverseMap = null)
        {
            // if no precalculated reverse map provided, build one
            if (reverseMap is null)
                reverseMap = ReverseCharMap(charMap);

            char[] chrs = number.ToCharArray();
            int m = chrs.Length - 1;
            int n = charMap.Length, x;
            long result = 0;
            for (int i = 0; i < chrs.Length; i++)
            {
                x = reverseMap[chrs[i]];
                result += x * (long)Math.Pow(n, m--);
            }
            return result;
        }

        /// <summary>
        /// <para>
        /// A generic standard base parser that works up to Base62.
        /// </para>
        ///
        /// <para>
        /// Uses a standard mapping: `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`
        /// truncated for smaller bases
        /// </para>
        /// </summary>
        /// <param name="value"></param>
        /// <param name="sourceBase"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentException">If a base is requested that's higher than possible using the standard mapping</exception>
        public static long FromBase(string number, int sourceBase)
        {
            if (sourceBase < 1 || sourceBase > BaseChars.Length)
                throw new ArgumentException(
                    $"The source base must be a positive integer that doesn't exceed {BaseChars.Length}",
                    nameof(sourceBase));

            return FromBase(number, BaseChars.Take(sourceBase).ToArray(), ReverseBaseChars);
        }
    }
}
