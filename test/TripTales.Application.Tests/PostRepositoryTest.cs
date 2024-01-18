using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TripTales.Application.Infrastructure;
using TripTales.Application.Infrastructure.Repositories;
using TripTales.Application.Model;

namespace TripTales.Application.Tests
{
    [Collection("Sequential")]
    public class PostRepositoryTest
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

        private async Task Initialize()
        {
            var db = GetDatabase();
            var user = new User("email@example.com", "password", "displayName", "registryName", "description");
            await db.User.AddAsync(user);
            await db.SaveChangesAsync();
            var repo = new PostRepository(db);
            var post = new TripPost("title", "description", DateTime.Now.Date, DateTime.UtcNow.AddDays(5), user);
            await repo.Insert(post);
        }

        //A test that checks if the post is inserted correctly
        [Fact]
        public async void InsertSuccessTest()
        {
            // ARRange
            var db = GetDatabase();
            var repo = new PostRepository(db);

            //create a User
            await Initialize();
            var post = new TripPost("title2", "description", DateTime.Now.Date, DateTime.UtcNow.AddDays(5), db.User.First());
            await repo.Insert(post);
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            Assert.True(db.Posts.Count() == 2);
        }

        //A test that cheks if the post is deleted correctly
        [Fact]
        public async void DeleteSuccessTest()
        {
            // ARRange
            var db = GetDatabase();
            var repo = new PostRepository(db);

            //create a User
            await Initialize();
            db.ChangeTracker.Clear();
            await repo.Delete(db.Posts.First().Guid);


            Assert.True(db.Posts.Count() == 0);
        }
    }
}
