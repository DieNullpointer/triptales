using Bogus;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using TripTales.Application.Model;

namespace TripTales.Application.Infrastructure
{
    public class TripTalesContext : DbContext
    {
        public DbSet<User> User => Set<User>();
        public DbSet<TripPost> Posts => Set<TripPost>();
        public DbSet<TripDay> Days => Set<TripDay>();
        public DbSet<TripLocation> Locations => Set<TripLocation>();
        public DbSet<Image> Images => Set<Image>();

        public TripTalesContext(DbContextOptions opt) : base(opt)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(e => e.Posts)
                .WithOne(e => e.User);
            modelBuilder.Entity<User>()
                .HasMany(e => e.Likes)
                .WithMany(e => e.Likes);
            // Generic config for all entities
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                // ON DELETE RESTRICT instead of ON DELETE CASCADE
                foreach (var key in entityType.GetForeignKeys())
                    key.DeleteBehavior = DeleteBehavior.Restrict;

                foreach (var prop in entityType.GetDeclaredProperties())
                {
                    // Define Guid as alternate key. The database can create a guid fou you.
                    if (prop.Name == "Guid")
                    {
                        modelBuilder.Entity(entityType.ClrType).HasAlternateKey("Guid");
                        prop.ValueGenerated = Microsoft.EntityFrameworkCore.Metadata.ValueGenerated.OnAdd;
                    }
                    // Default MaxLength of string Properties is 255.
                    if (prop.ClrType == typeof(string) && prop.GetMaxLength() is null) prop.SetMaxLength(255);
                    // Seconds with 3 fractional digits.
                    if (prop.ClrType == typeof(DateTime)) prop.SetPrecision(3);
                    if (prop.ClrType == typeof(DateTime?)) prop.SetPrecision(3);
                }
            }
        }

        public void Seed()
        {
            Randomizer.Seed = new Random(1532);
            var faker = new Faker("de");

            var users = new Faker<User>("de").CustomInstantiator(f =>
            {
                var person = f.Person;
                var user = new User(person.Email, "1234", person.UserName, person.UserName.ToLower(), f.Lorem.Text());
                return user;
            }).Generate(5).ToList();
            users.Add(new User("admin@nullpointer.at", "admin", "Administrator", "admin", "This is the admin User!"));
            User.AddRange(users);
            SaveChanges();

            List<string> paths = Directory.GetFiles("../TripTales.Application/Infrastructure/DevImages").ToList();
            List<Image> images = new();
            foreach(var path in paths)
            {
                images.Add(new Image(path, Path.GetFileNameWithoutExtension(path)));
            }
            Images.AddRange(images);
            SaveChanges();

            var posts = new Faker<TripPost>("de").CustomInstantiator(f =>
            {
                var dateb = DateTime.UtcNow.Date;
                var daten = f.Date.Between(dateb.AddDays(5), dateb.AddDays(10)).Date;
                var post = new TripPost(f.Random.Words(10), f.Random.Words(30), dateb, daten, f.PickRandom(users));
                post.Images.Add(f.PickRandom(images));
                return post;
            }).Generate(5).ToList();
            Posts.AddRange(posts);
            SaveChanges();

            var days = new Faker<TripDay>("de").CustomInstantiator(f =>
            {
                var date = f.Date.Future(0);
                var day = new TripDay(date, f.Random.Words(10), f.Random.Words(30), f.PickRandom(posts));
                return day;
            }).Generate(10).ToList();
            Days.AddRange(days);
            SaveChanges();
            
            var locations = new Faker<TripLocation>("de").CustomInstantiator(f =>
            {
                var location = new TripLocation(f.PickRandom(days), f.Random.AlphaNumeric(8));
                return location;
            }).Generate(20).ToList();
            Locations.AddRange(locations);
            SaveChanges();
        }
    }
}
