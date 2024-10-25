using Epm.LGoods.IdentityService.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.IdentityService.Application.Services
{
    public interface IVendorApprovalService
    {
        IEnumerable<VendorApprovalDto> GetPendingVendors();
        Task ApproveVendor(int vendorId);
        Task RejectVendor(int vendorId);
    }
}
