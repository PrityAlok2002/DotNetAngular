using Epm.LGoods.OrderManagement.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Core.Interfaces
{
    public interface IOrderDetailRepository
    {
        Task<OrderDetail> GetByIdAsync(int id);
        Task<IEnumerable<OrderDetail>> GetAllAsync();
        Task UpdateAsync(OrderDetail orderDetails);
    }
}