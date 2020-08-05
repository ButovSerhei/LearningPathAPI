using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
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

        [HttpGet]
        public IActionResult Test()
        {
            return Json( new { result = true });
        }

        [HttpPost]
        public IActionResult Test([FromBody]string info)
        {
            return Json(info);
        }


        [HttpPost]
        public ActionResult Send([FromBody] Mail model)
        {
            bool isSuccess = false;
            string message = string.Empty;

            if (model == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                message = "Mail object is null";
                return Json(new { result = isSuccess, message = message });
            }

            if (model.Email == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                message = "Receiver mail cannot be null";
                return Json(new { result = isSuccess, message = message });
            }

            try
            {
                _smtpManager.SendAsync(model.Email, model.Subject, model.Body).Wait();
                isSuccess = true;
            }
            catch (Exception e)
            {
                message = e.Message;
                isSuccess = false;
            }

            return Json(new { result = isSuccess, message = message });
        }
    }
}
