using Epm.LGoods.OrderManagement.Application.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Application.Services
{
    public interface IOrderDetailService
    {
        Task<OrderDetailDto> GetOrderDetailsAsync(int orderId);
        Task<IEnumerable<OrderDetailDto>> GetAllOrderDetailsAsync();
        Task<bool> UpdateOrderDetailsAsync(OrderDetailDto orderDetailsDto);
    }
}