using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace LearningPath.SmtpManager
{

    public class SmtpManager : ISmtpManager
    {
        private readonly ILogger<SmtpManager> _log;
        private readonly SmtpClient _smtpClient;
        private readonly IConfiguration _configuration;

        private readonly string _displayName;
        private readonly string _fromName;
        private readonly Regex _regex = new Regex(@"\A(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\Z", RegexOptions.IgnoreCase);

        public SmtpManager(ILogger<SmtpManager> log, IConfiguration configuration)
        {
            _log = log;
            _configuration = configuration;
            _displayName = _configuration["Email:Smtp:DisplayName"];
            _fromName = _configuration.GetValue<string>("Email:Smtp:Username");
            if (!string.IsNullOrEmpty(_configuration.GetValue<string>("Email:Smtp:DisplayEmail")))
            {
                _fromName = _configuration.GetValue<string>("Email:Smtp:DisplayEmail");
            }
            _smtpClient = new SmtpClient()
            {
                EnableSsl = true,
                Host = configuration.GetValue<string>("Email:Smtp:Host"),
                Port = _configuration.GetValue<int>("Email:Smtp:Port"),
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(
                    _configuration.GetValue<string>("Email:Smtp:Username"),
                    _configuration.GetValue<string>("Email:Smtp:Password")
                )
            };

        }


        private bool IsEmailValid(string emailAddress)
        {
            return _regex.IsMatch(emailAddress);
        }
        private MailMessage BuildMessage(string subject, string body, bool html = false)
        {
            var mail = new MailMessage()
            {
                IsBodyHtml = true,
                Subject = subject
            };
            var alternateView = AlternateView.CreateAlternateViewFromString(body, null, "text/html");
            mail.AlternateViews.Add(alternateView);
            return mail;
        }

        public Task SendAsync(string to, string subject, string body)
        {
            try
            {
                if (!IsEmailValid(to)) throw new ArgumentException("recipients. Email wrong format");
                var mail = BuildMessage(subject, body);
                if (!string.IsNullOrEmpty(_displayName))
                {
                    mail.From = new MailAddress(_fromName, _displayName);
                }
                mail.To.Add(to.Trim());
                return _smtpClient.SendMailAsync(mail);
            }
            catch (Exception e)
            {
                _log.LogError(e.GetBaseException().Message);
                return Task.FromException(e);
            }
        }
    }
}
