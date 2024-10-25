using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Core.Interfaces;
using Epm.LGoods.OrderManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Epm.LGoods.OrderManagement.Infrastructure.Repositories
{
    public class OrderItemRepository : IOrderItemRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderItemRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<OrderItem> GetByIdAsync(int id)
        {
            return await _context.OrderItems
                .Include(oi => oi.Product) // Include product details
                .FirstOrDefaultAsync(oi => oi.Id == id);
        }

        public async Task<IEnumerable<OrderItem>> GetByOrderDetailsIdAsync(int orderId)
        {
            return await _context.OrderItems
                .Include(oi => oi.Product) // Include product details
                .Where(oi => oi.OrderId == orderId)
                .ToListAsync();
        }
    }
}