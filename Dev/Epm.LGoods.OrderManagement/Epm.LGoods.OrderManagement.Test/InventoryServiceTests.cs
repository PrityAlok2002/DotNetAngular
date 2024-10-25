using Epm.LGoods.OrderManagement.Application.Services;
using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Core.Interfaces;
using Epm.LGoods.OrderManagement.Infrastructure.Repositories;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Tests
{
    [TestClass]
    public class InventoryServiceTests
    {
        private Mock<IInventoryRepository> _mockRepository;
        private IInventoryService _inventoryService;

        [TestInitialize]
        public void Setup()
        {
            _mockRepository = new Mock<IInventoryRepository>();
            _inventoryService = new InventoryService(_mockRepository.Object);
        }

        [TestMethod]
        public async Task GetByIdAsync_ReturnsInventory()
        {
            var inventory = new Inventory { InventoryId = 1 };
            _mockRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(inventory);

            var result = await _inventoryService.GetByIdAsync(1);

            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.InventoryId);
            _mockRepository.Verify(repo => repo.GetByIdAsync(1), Times.Once);
        }

        [TestMethod]
        public async Task GetAllAsync_ReturnsAllInventories()
        {
            var inventories = new List<Inventory>
            {
                new Inventory { InventoryId = 1 },
                new Inventory { InventoryId = 2 }
            };
            _mockRepository.Setup(repo => repo.GetAllAsync()).ReturnsAsync(inventories);

            var result = await _inventoryService.GetAllAsync();

            Assert.AreEqual(2, result.Count());
            _mockRepository.Verify(repo => repo.GetAllAsync(), Times.Once);
        }

        [TestMethod]
        public async Task AddAsync_AddsInventory()
        {
            var inventoryToAdd = new Inventory { InventoryId = 3 };
            _mockRepository.Setup(repo => repo.AddAsync(inventoryToAdd)).Returns(Task.CompletedTask);

            await _inventoryService.AddAsync(inventoryToAdd);

            _mockRepository.Verify(repo => repo.AddAsync(inventoryToAdd), Times.Once);
        }

        [TestMethod]
        public async Task UpdateAsync_UpdatesInventory()
        {
            var inventoryToUpdate = new Inventory { InventoryId = 1 };
            _mockRepository.Setup(repo => repo.UpdateAsync(inventoryToUpdate)).Returns(Task.CompletedTask);

            await _inventoryService.UpdateAsync(inventoryToUpdate);

            _mockRepository.Verify(repo => repo.UpdateAsync(inventoryToUpdate), Times.Once);
        }

        [TestMethod]
        public async Task DeleteAsync_DeletesInventory()
        {
            int inventoryIdToDelete = 1;
            _mockRepository.Setup(repo => repo.DeleteAsync(inventoryIdToDelete)).Returns(Task.CompletedTask);

            await _inventoryService.DeleteAsync(inventoryIdToDelete);

            _mockRepository.Verify(repo => repo.DeleteAsync(inventoryIdToDelete), Times.Once);
        }
    }
}