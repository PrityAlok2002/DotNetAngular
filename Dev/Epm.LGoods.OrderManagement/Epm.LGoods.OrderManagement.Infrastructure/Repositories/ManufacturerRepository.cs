using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Core.Interfaces;
using Epm.LGoods.OrderManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Infrastructure.Repositories
{
    public class ManufacturerRepository : IManufacturerRepository
    {
        private readonly ApplicationDbContext _context;

        public ManufacturerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ManufacturerDetails> GetByIdAsync(int id)
        {
            return await _context.Manufacturers
                .Include(m => m.Vendor) // Include vendor details
                .FirstOrDefaultAsync(m => m.ManufacturerId == id);
        }

        public async Task<IEnumerable<ManufacturerDetails>> GetAllAsync()
        {
            return await _context.Manufacturers
                .Include(m => m.Vendor) // Include vendor details
                .ToListAsync();
        }

        public async Task AddAsync(ManufacturerDetails manufacturer)
        {
            _context.Manufacturers.Add(manufacturer);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ManufacturerDetails manufacturer)
        {
            _context.Manufacturers.Update(manufacturer);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var manufacturer = await GetByIdAsync(id);
            if (manufacturer != null)
            {
                _context.Manufacturers.Remove(manufacturer);
                await _context.SaveChangesAsync();
            }
        }
    }
}
