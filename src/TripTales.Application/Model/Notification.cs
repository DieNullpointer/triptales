using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TripTales.Application.Model
{
    public class Notification : IEntity<int>
    {
        public Notification(User user, NotificationType notificationType, User? sender = null)
        {
            User = user;
            NotificationType = notificationType;
            IsRead = false;
            Sender = sender;
        }

        #pragma warning disable CS8618
        protected Notification() { }
        #pragma warning restore CS8618

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public User User { get; set; }
        public NotificationType NotificationType { get; set; }
        public bool IsRead { get; set; }
        public User? Sender { get; set; }
    }
}
