using System;

namespace Decsys.Data.Entities
{
    public abstract class BaseComponent
    {
        /// <summary>
        /// DO NOT USE. Only provided for ORM use.
        /// </summary>
        [Obsolete]
        public BaseComponent() { }

        /// <summary>
        /// Create a Component of the specified type.
        /// </summary>
        /// <param name="type">The component type.</param>
        public BaseComponent(string type)
        {
            Type = type;
        }

        public Guid Id { get; set; } = Guid.NewGuid();

        public int Order { get; set; }

        public string Type { get; set; } = string.Empty;

        /// <summary>
        /// Whether this item is used to provide meaningful "Question"
        /// content in aggregated results
        /// </summary>
        public bool IsQuestionItem { get; set; }

        /// <summary>
        /// Whether the response item is set to be Optional
        /// </summary>
        public bool IsOptional { get; set; }

    }
}
