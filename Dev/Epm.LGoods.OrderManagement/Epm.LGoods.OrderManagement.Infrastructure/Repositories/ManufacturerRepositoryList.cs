using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Core.Interfaces;
using Epm.LGoods.OrderManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Epm.LGoods.OrderManagement.Infrastructure.Repositories
{
    public class ManufacturerRepositoryList : IManufacturerRepositoryList
    {
        private readonly ApplicationDbContext _context;

        public ManufacturerRepositoryList(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ManufacturerDetails>> GetAllAsync()
        {
            return await _context.Manufacturers.ToListAsync();
        }

        public async Task<ManufacturerDetails> GetByIdAsync(int id)
        {
            return await _context.Manufacturers.FindAsync(id);
        }

        public async Task<ManufacturerDetails> AddAsync(ManufacturerDetails manufacturer)
        {
            var result = await _context.Manufacturers.AddAsync(manufacturer);
            await _context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task UpdateAsync(ManufacturerDetails manufacturer)
        {
            _context.Manufacturers.Update(manufacturer);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(ManufacturerDetails manufacturer)
        {
            _context.Manufacturers.Remove(manufacturer);
            await _context.SaveChangesAsync();
        }
    }
}
