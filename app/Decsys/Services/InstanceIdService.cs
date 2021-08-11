using System;
using System.Collections.Generic;
using System.Linq;

namespace Decsys.Services
{
    public static class InstanceIdService
    {
        /* Notes on Decsys Base35:
         * 
         * - We use base 35 because it's wholly alphanmumeric but without worrying about alpha case.
         *   - this eases user experience as a is no different to A
         * - we start with letters then use numbers; this creates the illusion of nicer Id's
         *   - (id 0 is a, not 0)
         *   - this is not a conventional baseN character order (e.g. hex is numeric first: 0123456789abcdef)
         * - it's Base 35 not Base 36, as `z` is excluded from the encoding for use as a value delimiter
         *   - this way we can encode an arbitrary number of integer id's, and have the resulting combined value be only an alphanumeric string
         *   - e.g. survey 1 instance 1 is `bzb`
         */


        // Build static Base35 lookups for both directions
        private static readonly char[] _charMap = "abcdefghijklmnopqrstuvwxy0123456789".ToCharArray();
        private static readonly Dictionary<char, int> _valueMap = _charMap
            .Select((c, i) => new { c, v = i })
            .ToDictionary(c => c.c, c => c.v);

        public static string ToDecsysBase35(this int value)
        {
            int targetBase = _charMap.Length;
            // Determine exact number of characters to use.
            char[] buffer = new char[Math.Max(
                       (int)Math.Ceiling(Math.Log(value + 1, targetBase)), 1)];

            var i = buffer.Length;
            do
            {
                buffer[--i] = _charMap[value % targetBase];
                value /= targetBase;
            }
            while (value > 0);

            return new string(buffer, i, buffer.Length - i);
        }

        public static int FromDecsysBase35(this string number)
        {
            char[] chars = number.ToCharArray();
            int m = chars.Length - 1;
            int n = _charMap.Length, x;
            int result = 0;
            for (int i = 0; i < chars.Length; i++)
            {
                x = _valueMap[chars[i]];
                result += x * (int)Math.Pow(n, m--);
            }
            return result;
        }

        /// <summary>
        /// Encode a Survey ID and Instance ID as a friendly combined alphanumeric id
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="instanceId"></param>
        /// <returns></returns>
        public static string Encode(int surveyId, int instanceId)
            => $"{surveyId.ToDecsysBase35()}z{instanceId.ToDecsysBase35()}";

        /// <summary>
        /// Decode a friendly combined id into its consituent Survey and Instance Id's
        /// </summary>
        /// <param name="friendlyId"></param>
        /// <returns></returns>
        public static (int surveyId, int instanceId) Decode(string friendlyId)
        {
            var ids = friendlyId.Split("z")
                .Select(n => n.FromDecsysBase35())
                .ToList();
            return (ids[0], ids[1]);
        }
    }
}
