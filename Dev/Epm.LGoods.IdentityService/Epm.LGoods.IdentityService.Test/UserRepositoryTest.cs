using Epm.LGoods.IdentityService.Core.Entities;
using Epm.LGoods.IdentityService.Infrastructure.Data;
using Epm.LGoods.IdentityService.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;

namespace Epm.LGoods.IdentityService.Test
{
    [TestClass]
    public class UserRepositoryTest
    {
        private ApplicationDbContext _context;
        private UserRepository _userRepository;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(options);
            _userRepository = new UserRepository(_context);
        }

        [TestCleanup]
        public void Cleanup()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [TestMethod]
        public void AddUser_ShouldAddUser()
        {
            var user = new User
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                Password = "password123",
                MobileNumber = "1234567890",
                AccountType = "Admin"
            };

            _userRepository.Add(user);

            var addedUser = _context.Users.FirstOrDefault(u => u.Email == "john.doe@example.com");
            Assert.IsNotNull(addedUser);
            Assert.AreEqual("John", addedUser.FirstName);
        }

        [TestMethod]
        public void GetAll_ShouldReturnAllUsers()
        {
            var user1 = new User
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                Password = "password123",
                MobileNumber = "1234567890",
                AccountType = "Admin"
            };

            var user2 = new User
            {
                FirstName = "Jane",
                LastName = "Doe",
                Email = "jane.doe@example.com",
                Password = "password456",
                MobileNumber = "0987654321",
                AccountType = "User"
            };

            _userRepository.Add(user1);
            _userRepository.Add(user2);

            var users = _userRepository.GetAll().ToList();

            Assert.AreEqual(2, users.Count);
            Assert.IsTrue(users.Any(u => u.Email == "john.doe@example.com"));
            Assert.IsTrue(users.Any(u => u.Email == "jane.doe@example.com"));
        }

        [TestMethod]
        public void GetById_ShouldReturnUser()
        {
            var user = new User
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                Password = "password123",
                MobileNumber = "1234567890",
                AccountType = "Admin"
            };

            _userRepository.Add(user);
            var addedUser = _context.Users.FirstOrDefault(u => u.Email == "john.doe@example.com");

            var foundUser = _userRepository.GetById(addedUser.UserId);

            Assert.IsNotNull(foundUser);
            Assert.AreEqual("John", foundUser.FirstName);
        }

        [TestMethod]
        public void UpdateUser_ShouldUpdateUser()
        {
            var user = new User
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                Password = "password123",
                MobileNumber = "1234567890",
                AccountType = "Admin"
            };

            _userRepository.Add(user);
            var addedUser = _context.Users.FirstOrDefault(u => u.Email == "john.doe@example.com");

            addedUser.LastName = "Smith";
            _userRepository.Update(addedUser);

            var updatedUser = _context.Users.FirstOrDefault(u => u.Email == "john.doe@example.com");
            Assert.AreEqual("Smith", updatedUser.LastName);
        }

        [TestMethod]
        public void DeleteUser_ShouldRemoveUser()
        {
            var user = new User
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                Password = "password123",
                MobileNumber = "1234567890",
                AccountType = "Admin"
            };

            _userRepository.Add(user);
            var addedUser = _context.Users.FirstOrDefault(u => u.Email == "john.doe@example.com");

            _userRepository.Delete(addedUser);

            var deletedUser = _context.Users.FirstOrDefault(u => u.Email == "john.doe@example.com");
            Assert.IsNull(deletedUser);
        }
    }
}

