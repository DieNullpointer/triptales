using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TripTales.Application.Model
{
    public class Follower : IEntity<int>
    {
        public Follower(User sender, User recipient, DateTime dateTime)
        {
            Sender = sender;
            Recipient = recipient;
            DateTime = dateTime;
        }

#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        protected Follower() { }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public User Sender { get; set; }
        public User Recipient { get; set; }
        public DateTime DateTime { get; set; }
    }
}
