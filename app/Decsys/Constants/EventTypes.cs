namespace Decsys.Constants
{

    public static class EventTypes
    {
        /// <summary>
        /// <para>An event with a payload containing response values.</para>
        /// <para>Corresponding Event Source should be the response item id</para>
        /// </summary>
        public const string COMPONENT_RESULTS = "decsys.platform.COMPONENT_RESULTS";

        /// <summary>
        /// <para>An Event indicating a Page loaded succesfully.</para>
        /// <para>Corresponding Event Source shold be the page id</para>
        /// </summary>
        public const string PAGE_LOAD = "decsys.platform.PAGE_LOAD";

        /// <summary>
        /// <para>An Event recording a participant's survey page order, as a payload of page id's</para>
        /// <para>Corresponding Event Source should be the survey id</para>
        /// </summary>
        public const string PAGE_RANDOMIZE = "decsys.platform.PAGE_RANDOMIZE";

        /// <summary>
        /// <para>
        /// An Event indicating completion of a Survey by a Participant
        /// (i.e. having submitted the final question)
        /// </para>
        /// <para>Corresponding Event Source should be the survey id</para>
        /// </summary>
        public const string SURVEY_COMPLETE = "decsys.platform.SURVEY_COMPLETE";

        /// <summary>
        /// <para>An Event indicating a page navigation within the Survey, with a payload containing the target page to navigate to.</para>
        /// <para>Valid targets might be `next`, `previous` or a specific page order or id</para>
        /// <para>
        /// Navigation requests may not be successful; this event records valid navigations,
        /// such that progress state can calculated accordingly.
        /// </para>
        /// <para>Corresponding Event Source should be the page id</para>
        /// </summary>
        public const string PAGE_NAVIGATION = "decsys.platform.PAGE_NAVIGATION";
    }
}
