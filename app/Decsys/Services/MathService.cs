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

        #region Weighted Rand

        public T PickRandomWeightedItem<T>(List<(T item, double weight)> weightedItems)
        {
            if (weightedItems.Count <= 0)
                throw new ArgumentException(
                    "Can't randomly pick an item from an empty list!",
                    nameof(weightedItems));

            var ratioSum = weightedItems.Sum(x => x.weight);
            var randomValue = Random.NextDouble() * ratioSum;

            foreach(var item in weightedItems)
            {
                randomValue -= item.weight;

                if (randomValue > 0) continue;

                return item.item;
            }

            // this should never occur due to scaling the random number by the sum of all ratios
            // meaning that if you got to the end of the list, you're guaranteed to go below zero and return a value
            // but the compiler doesn't do that detailed an assessment,
            // so to shut it up, we return the final item in the list if we somehow escaped the foreach without returning.
            // and yes, the final item is the correct item, since List<T> always iterates in index order.
            return weightedItems.Last().item;
        }

        #endregion
    }
}
