using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Application.Services
{
    public class InventoryService : IInventoryService
    {
        private readonly IInventoryRepository _inventoryRepository;

        public InventoryService(IInventoryRepository inventoryRepository)
        {
            _inventoryRepository = inventoryRepository;
        }

        public async Task<Inventory> GetByIdAsync(int inventoryId)
        {
            return await _inventoryRepository.GetByIdAsync(inventoryId);
        }

        public async Task<IEnumerable<Inventory>> GetAllAsync()
        {
            return await _inventoryRepository.GetAllAsync();
        }

        public async Task AddAsync(Inventory inventory)
        {
            await _inventoryRepository.AddAsync(inventory);
        }

        public async Task UpdateAsync(Inventory inventory)
        {
            await _inventoryRepository.UpdateAsync(inventory);
        }

        public async Task DeleteAsync(int inventoryId)
        {
            await _inventoryRepository.DeleteAsync(inventoryId);
        }
    }
}