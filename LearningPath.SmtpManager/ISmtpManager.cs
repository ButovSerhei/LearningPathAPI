using System;
using System.Collections.Generic;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace LearningPath.SmtpManager
{

    public interface ISmtpManager
    {

        /// <summary>
        /// (Async) Send simple text email
        /// </summary>
        /// <param name="to">Receiver email</param>
        /// <param name="subject">Email subject</param>
        /// <param name="body">Email body</param>
        /// <returns></returns>
        Task SendAsync(string to, string subject, string body);

    }

}
