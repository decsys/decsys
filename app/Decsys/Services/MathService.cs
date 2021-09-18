using System;
using System.Collections.Generic;
using System.Linq;

namespace Decsys.Services
{
    /// <summary>
    /// Provides useful general Math functionality
    /// </summary>
    public class MathService
    {
        public readonly Random Random = new();

        /// <summary>
        /// Randomly reorder a List in place
        /// </summary>
        public void Shuffle<T>(ref List<T> items)
        {
            for (var i = items.Count - 1; i > 0; i--)
            {
                int j = Random.Next(0, i + 1);
                var itemJ = items[j];
                items[j] = items[i];
                items[i] = itemJ;
            }
        }

        #region GCD

        /// <summary>
        /// Find the Greatest Common Denominator of 2 numbers
        /// using Extended Euclidean Algorithm
        /// </summary>
        /// <param name="a"></param>
        /// <param name="b"></param>
        /// <returns></returns>
        public static int Gcd(int a, int b)
            => b == 0 ? a : Gcd(b, a % b);

        /// <summary>
        /// Find the Greatest Common Denominator of all passed numbers
        /// using Extended Euclidean Algorithm
        /// </summary>
        /// <param name="numbers"></param>
        /// <returns></returns>
        public static int Gcd(params int[] numbers)
            => Gcd(numbers.ToList());

        /// <summary>
        /// Find the Greatest Common Denominator of all numbers in a list
        /// using Extended Euclidean Algorithm
        /// </summary>
        /// <param name="numbers"></param>
        /// <returns></returns>
        public static int Gcd(List<int> numbers)
            => numbers.Aggregate(0, (a, n) => Gcd(n, a));

        #endregion
    }
}
