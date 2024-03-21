using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace TripTales.Webapi.Services
{
    public class EmailSender : IEmailSender
    {
        private readonly IConfiguration _config;
        public EmailSender(IConfiguration configuration)
        {
            _config = configuration;
        }
        public Task SendEmailAsync(string email, string subject, string message)
        {
            /*var client = new SmtpClient("smtp.office365.com", 587)
            {
                DeliveryMethod = SmtpDeliveryMethod.Network,
                EnableSsl = true,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(_config["Email"], _config["Password"]),
            };*/
            var client = new SmtpClient("smtp.gmail.com", 587)
            {
                DeliveryMethod = SmtpDeliveryMethod.Network,
                EnableSsl = true,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(_config["Email"], _config["Password"]),
            };
            var mailmessage = new MailMessage(_config["Email"], email, subject, message);
            mailmessage.IsBodyHtml = true;
            return client.SendMailAsync(mailmessage);
        }
    }
}
