using Epm.LGoods.OrderManagement.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Application.Services
{
    public interface IInventoryService
    {
        Task<Inventory> GetByIdAsync(int inventoryId);
        Task<IEnumerable<Inventory>> GetAllAsync();
        Task AddAsync(Inventory inventory);
        Task UpdateAsync(Inventory inventory);
        Task DeleteAsync(int inventoryId);
    }
}
