using Epm.LGoods.IdentityService.Application.Dtos;
using Epm.LGoods.IdentityService.Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Epm.LGoods.IdentityService.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminVendorApprovalController : ControllerBase
    {
        private readonly IVendorApprovalService _vendorApprovalService;

        public AdminVendorApprovalController(IVendorApprovalService vendorApprovalService)
        {
            _vendorApprovalService = vendorApprovalService;
        }

        [HttpGet("pending")]
        public ActionResult<IEnumerable<VendorApprovalDto>> GetPendingVendors()
        {
            var pendingVendors = _vendorApprovalService.GetPendingVendors();
            return Ok(pendingVendors);
        }

        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApproveVendor(int id)
        {
            await _vendorApprovalService.ApproveVendor(id);
            return NoContent();
        }

        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectVendor(int id)
        {
            await _vendorApprovalService.RejectVendor(id);
            return NoContent();
        }
    }
}