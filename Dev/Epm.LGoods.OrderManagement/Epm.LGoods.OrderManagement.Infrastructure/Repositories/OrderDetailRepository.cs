using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Core.Interfaces;
using Epm.LGoods.OrderManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Infrastructure.Repositories
{
    public class OrderDetailRepository : IOrderDetailRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<OrderDetail> GetByIdAsync(int id)
        {
            return await _context.OrderDetails.FindAsync(id);
        }

        public async Task<IEnumerable<OrderDetail>> GetAllAsync()
        {
            return await _context.OrderDetails.ToListAsync();
        }

        public async Task UpdateAsync(OrderDetail orderDetails)
        {
            _context.Entry(orderDetails).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}