using Epm.LGoods.IdentityService.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.IdentityService.Core.Interfaces
{
    public interface IVendorDetailsRepository
    {
        IEnumerable<VendorDetails> GetAll();
        VendorDetails GetById(int id);
        void Add(VendorDetails vendorDetails);
        void Update(VendorDetails vendorDetails);
        void Delete(VendorDetails vendorDetails);
    }
}
