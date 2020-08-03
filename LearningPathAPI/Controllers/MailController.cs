using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Threading.Tasks;
using LearningPath.SmtpManager;
using LearningPathApi.Models.Mail;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;

namespace LearningPathApi.WebApplication.Controllers
{
   
    public class MailController : Controller
    {
        private readonly ISmtpManager _smtpManager;

        public MailController(ISmtpManager smtpManager)
        {
            _smtpManager = smtpManager;
        }


        [HttpPost]
        public ActionResult Send(Mail model)
        {
            bool isSuccess = false;
            string message = string.Empty;

            if (model == null)
            {
                Response.StatusCode = (int) HttpStatusCode.BadRequest;
                message = "Mail object is null";
                return Json(new { result = isSuccess, message = message });
            }

            try
            {
                _smtpManager.SendAsync(model.Email, model.Subject, model.Body);
                isSuccess = true;
            }
            catch (Exception e)
            {
                message = e.Message;
                isSuccess = false;
            }

            return Json(new {result = isSuccess, message = message});
        }
    }
}
