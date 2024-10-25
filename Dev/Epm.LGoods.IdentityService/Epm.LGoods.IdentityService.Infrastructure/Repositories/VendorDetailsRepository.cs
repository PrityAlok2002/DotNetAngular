using Epm.LGoods.IdentityService.Core.Entities;
using Epm.LGoods.IdentityService.Core.Interfaces;
using Epm.LGoods.IdentityService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Epm.LGoods.IdentityService.Infrastructure.Repositories
{
    public class VendorDetailsRepository : IVendorDetailsRepository
    {
        private readonly ApplicationDbContext _context;

        public VendorDetailsRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public VendorDetails GetById(int id)
        {
            return _context.VendorDetails.Find(id);
        }

        public void Add(VendorDetails vendorDetails)
        {
            _context.VendorDetails.Add(vendorDetails);
            _context.SaveChanges();
        }

        public void Update(VendorDetails vendorDetails)
        {
            _context.VendorDetails.Update(vendorDetails);
            _context.SaveChanges();
        }

        public void Delete(VendorDetails vendorDetails)
        {
            _context.VendorDetails.Remove(vendorDetails);
            _context.SaveChanges();
        }

        public IEnumerable<VendorDetails> GetAll()
        {
            return _context.VendorDetails.ToList();
        }
    }
}

