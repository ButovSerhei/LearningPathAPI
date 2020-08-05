using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace LearningPathApi.Models.Mail
{
    public class Mail
    {
        [JsonProperty("Email")]
        public string Email { get; set; }

        [JsonProperty("Subject")]
        public string Subject { get; set; }

        [JsonProperty("Body")]
        public string Body { get; set; }
    }
}
