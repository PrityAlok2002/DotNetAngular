using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Infrastructure.Data;
using Epm.LGoods.OrderManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Test
{
    [TestClass]
    public class CustomerRepositoryTests
    {
        private CustomerRepository _customerRepository;
        private ApplicationDbContext _context;

        [TestInitialize]
        public void TestInitialize()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase") // Use in-memory database
                .Options;

            _context = new ApplicationDbContext(options);
            _customerRepository = new CustomerRepository(_context);
        }

        [TestMethod]
        public async Task GetByIdAsync_WhenCalled_ReturnsCustomer()
        {
            // Arrange
            var customerId = 1;
            var customer = new Customer
            {
                Id = customerId,
                Email = "test@example.com",
                Name = "Test User",
                Password = "TestPassword",
                PhoneNumber = "1234567890"
            };
            _context.Customers.Add(customer);
            _context.SaveChanges();

            // Act
            var result = await _customerRepository.GetByIdAsync(customerId);

            // Assert
            Assert.AreEqual(customer, result);
        }

        [TestCleanup]
        public void TestCleanup()
        {
            _context.Database.EnsureDeleted(); // Clean up the in-memory database
        }
    }
}