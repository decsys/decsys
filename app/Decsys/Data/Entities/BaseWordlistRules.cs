using System;

namespace Decsys.Data.Entities
{
    public abstract class BaseWordlistRules
    {
        /// <summary>
        /// DO NOT USE. Only provided for ORM use.
        /// </summary>
        [Obsolete]
        public BaseWordlistRules() { }

        /// <summary>
        /// Creates a world list rules with a sepcified type, targetProperty and Operator.
        /// </summary>
        /// <param name="type">The word list type.</param>
        /// <param name="targetProperty">The word list target property .</param>
        /// <param name="operator">The word list operator</param>
        public BaseWordlistRules(string type, string targetProperty, string @operator)
        {
            Type = type;
            TargetProperty = targetProperty;
            Operator = @operator;
        }

        public string Type { get; set; } = string.Empty;
        public bool IsInclusionCriteria { get; set; }
        public string TargetProperty { get; set; } = string.Empty;
        public string Operator { get; set; } = string.Empty;

    }
}
