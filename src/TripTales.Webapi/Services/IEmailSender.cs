using System.Threading.Tasks;

namespace TripTales.Webapi.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string message);
    }
}
