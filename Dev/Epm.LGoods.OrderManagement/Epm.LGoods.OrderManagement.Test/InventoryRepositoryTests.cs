using Microsoft.VisualStudio.TestTools.UnitTesting;
using Epm.LGoods.OrderManagement.Infrastructure.Data;
using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Test
{
    [TestClass]
    public class InventoryRepositoryTests
    {
        private ApplicationDbContext _context;
        private InventoryRepository _repository;

        [TestInitialize]
        public void Initialize()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDb")
                .Options;

            _context = new ApplicationDbContext(options);
            _repository = new InventoryRepository(_context);

            // Seed the database
            _context.Inventories.AddRange(
                new Inventory { InventoryId = 1 },
                new Inventory { InventoryId = 2 }
            );
            _context.SaveChanges();
        }

        [TestCleanup]
        public void Cleanup()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [TestMethod]
        public async Task GetByIdAsync_ReturnsInventory()
        {
            var result = await _repository.GetByIdAsync(1);
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.InventoryId);
        }

        [TestMethod]
        public async Task GetAllAsync_ReturnsAllInventories()
        {
            var result = await _repository.GetAllAsync();
            Assert.AreEqual(2, result.Count());
        }

        [TestMethod]
        public async Task AddAsync_IncreasesCount()
        {
            var inventoryToAdd = new Inventory { InventoryId = 3 };
            await _repository.AddAsync(inventoryToAdd);
            var allInventories = await _repository.GetAllAsync();
            Assert.AreEqual(3, allInventories.Count());
        }

        [TestMethod]
        public async Task DeleteAsync_DecreasesCount()
        {
            await _repository.DeleteAsync(1);
            var allInventories = await _repository.GetAllAsync();
            Assert.AreEqual(1, allInventories.Count());
            Assert.IsNull(await _repository.GetByIdAsync(1));
        }
    }
}