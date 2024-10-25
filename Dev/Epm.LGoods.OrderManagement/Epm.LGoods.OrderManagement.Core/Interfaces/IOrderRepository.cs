using Epm.LGoods.OrderManagement.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Core.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> GetByIdAsync(int id);
        Task<IEnumerable<Order>> GetAllAsync();
      //  Task<IEnumerable<Order>> GetActiveOrdersAsync();
        Task UpdateAsync(Order order);

        Task<List<Order>> GetLatestOrdersAsync();

    }
}
