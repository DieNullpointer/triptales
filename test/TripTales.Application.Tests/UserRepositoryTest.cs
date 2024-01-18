using Microsoft.EntityFrameworkCore;
using System.Linq;
using TripTales.Application.Dto;
using TripTales.Application.Infrastructure;
using TripTales.Application.Infrastructure.Repositories;
using TripTales.Application.Model;

namespace TripTales.Application.Tests
{
    [Collection("Sequential")]
    public class UserRepositoryTest
    {
        public TripTalesContext GetDatabase()
        {
            var options = new DbContextOptionsBuilder()
                .UseSqlite("DataSource=test.db")
                .Options;
            var db = new TripTalesContext(options);
            db.Database.EnsureDeleted();
            db.Database.EnsureCreated();
            return db;
        }

        [Fact]
        public async void InsertSuccessTest()
        {
            // ARRange
            var db = GetDatabase();
            var repo = new UserRepository(db);

            var user = new User("email@example.com", "password", "displayName", "registryName", "description");
            await repo.Insert(user);
            db.ChangeTracker.Clear();

            Assert.True(db.User.Count() == 1);
        }

        [Fact]
        public async void DeleteSuccessTest()
        {
            // ARRange
            var db = GetDatabase();
            var repo = new UserRepository(db);

            var user = new User("email@example.com", "password", "displayName", "registryName", "description");
            await db.User.AddAsync(user);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            // ACT
            await repo.Delete(user.Guid);

            // ASSERT
            Assert.True(db.User.Count() == 0);
        }

        [Fact]
        public async void UpdateSuccessTest()
        {
            // ARRange
            var db = GetDatabase();
            var repo = new UserRepository(db);

            var user = new User("email@example.com", "password", "displayName", "registryName", "description", "Wien", "Kairo");
            await db.User.AddAsync(user);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            // ACT
            var user2 = new User("email@spengergasse.com", "1234", "test", "Name", "Beschreibung");
            user2.Guid = user.Guid;
            await repo.Update(user2);

            // ASSERT
            Assert.True(db.User.First().Guid == user.Guid && db.User.First().Email == user2.Email);
        }
    }
}
