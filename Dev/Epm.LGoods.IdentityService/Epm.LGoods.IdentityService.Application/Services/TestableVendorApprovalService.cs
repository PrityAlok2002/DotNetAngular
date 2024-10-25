using Epm.LGoods.IdentityService.Application.Dtos;
using Epm.LGoods.IdentityService.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.IdentityService.Application.Services
{
    public class TestableVendorApprovalService : VendorApprovalService
    {
        private Func<string, string, string, Task> _sendEmailOverride;
        public TestableVendorApprovalService(
            IVendorDetailsRepository vendorDetailsRepository,
            IUserRepository userRepository,
            IConfiguration configuration)
            : base(vendorDetailsRepository, userRepository, configuration)
        {
        }

        public new VendorApprovalDto UpdateVendorStatus(int vendorId, string status)
        {
            return base.UpdateVendorStatus(vendorId, status);
        }

        public void SetSendEmailOverride(Func<string, string, string, Task> sendEmailFunc)
        {
            _sendEmailOverride = sendEmailFunc;
        }

        protected override Task SendEmail(string toEmail, string subject, string body)
        {
            if (_sendEmailOverride != null)
            {
                return _sendEmailOverride(toEmail, subject, body);
            }
            return base.SendEmail(toEmail, subject, body);
        }
    }
}