using Epm.LGoods.OrderManagement.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Application.Services
{
    public interface IOrderService
    {
        Task<OrderDto> GetOrderAsync(int orderId);
        Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
        Task<bool> UpdateOrderStatusAsync(UpdateOrderStatusDto updateOrderStatusDto);

        Task<List<LatestOrderDto>> GetLatestOrdersAsync();
    }

}
