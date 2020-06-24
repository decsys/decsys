using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using AutoMapper;
using Decsys.Data;
using Decsys.Data.Entities;
using LiteDB;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Decsys.Services
{

    public static class EventTypes
    {
        public const string COMPONENT_RESULTS = "decsys.platform.COMPONENT_RESULTS";
        public const string PAGE_LOAD = "decsys.platform.PAGE_LOAD";
        public const string PAGE_RANDOMIZE = "decsys.platform.PAGE_RANDOMIZE";
        public const string SURVEY_COMPLETE = "decsys.platform.SURVEY_COMPLETE";
    }
}
