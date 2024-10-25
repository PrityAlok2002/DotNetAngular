using Epm.LGoods.IdentityService.Application.Dtos;
using Epm.LGoods.IdentityService.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Epm.LGoods.IdentityService.Core.Entities;
using System.Net.Mail;
using System.Net;

namespace Epm.LGoods.IdentityService.Application.Services
{
    public class VendorApprovalService : IVendorApprovalService
    {
        private readonly IVendorDetailsRepository _vendorDetailsRepository;
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;


        public VendorApprovalService(
            IVendorDetailsRepository vendorDetailsRepository,
            IUserRepository userRepository,
            IConfiguration configuration)
        {
            _vendorDetailsRepository = vendorDetailsRepository;
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public IEnumerable<VendorApprovalDto> GetPendingVendors()
        {
            var pendingVendors = _vendorDetailsRepository.GetAll().Where(v => v.Status == "pending");
            return pendingVendors.Select(v => MapToDto(v));
        }

        public async Task ApproveVendor(int vendorId)
        {
            var vendor = UpdateVendorStatus(vendorId, "approved");
            if (vendor != null)
            {
                await SendEmail(vendor.VendorEmail, "Vendor Application Approved",
                    "Your vendor application has been approved. Welcome aboard!");
            }
            else
            {
                throw new InvalidOperationException("Vendor status must be pending to reject.");
            }
        }

        public async Task RejectVendor(int vendorId)
        {
            var vendor = UpdateVendorStatus(vendorId, "rejected");
            if (vendor != null)
            {
                await SendEmail(vendor.VendorEmail, "Vendor Application Rejected",
                    "We regret to inform you that your vendor application has been rejected.");
            }
            else
            {
                throw new InvalidOperationException("Vendor is not pending approval");
            }
        }

        protected virtual VendorApprovalDto UpdateVendorStatus(int vendorId, string status)
        {
            var vendor = _vendorDetailsRepository.GetById(vendorId);
            if (vendor != null && vendor.Status == "pending")
            {
                vendor.Status = status;
                _vendorDetailsRepository.Update(vendor);
                return MapToDto(vendor);
            }
            return null;
        }

        private VendorApprovalDto MapToDto(VendorDetails vendorDetails)
        {
            var user = _userRepository.GetById(vendorDetails.UserId);
            return new VendorApprovalDto
            {
                VendorId = vendorDetails.VendorId,
                BusinessName = vendorDetails.BusinessName,
                City = vendorDetails.City,
                State = vendorDetails.State,
                Zipcode = vendorDetails.Zipcode,
                Status = vendorDetails.Status,
                RegistrationDate = vendorDetails.RegistrationDate,
                UserId = vendorDetails.UserId,
                VendorName = $"{user.FirstName} {user.LastName}",
                VendorEmail = user.Email
            };
        }
        protected virtual async Task SendEmail(string toEmail, string subject, string body)
        {
            var smtpServer = _configuration["SmtpSettings:Server"];
            var smtpPort = int.Parse(_configuration["SmtpSettings:Port"]);
            var smtpUsername = _configuration["SmtpSettings:Username"];
            var smtpPassword = _configuration["SmtpSettings:Password"];
            var fromEmail = _configuration["SmtpSettings:FromEmail"];
            var maxRetries = 3;
            var delayBetweenRetries = TimeSpan.FromMinutes(2);

            for (int attempt = 0; attempt < maxRetries; attempt++)
            {
                try
                {
                    using (var client = new SmtpClient(smtpServer, smtpPort))
                    {
                        client.UseDefaultCredentials = false;
                        client.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
                        client.EnableSsl = true;

                        var mailMessage = new MailMessage
                        {
                            From = new MailAddress(fromEmail),
                            Subject = subject,
                            Body = body,
                            IsBodyHtml = false,
                        };
                        mailMessage.To.Add(toEmail);

                        await client.SendMailAsync(mailMessage);
                        // If successful, exit the loop
                        return;
                    }
                }
                catch (Exception ex)
                {
                    if (attempt == maxRetries - 1)
                    {
                        // Log the exception or handle it as needed
                        // Example: throw; to propagate the exception or log it
                        throw;
                    }
                    // Wait before retrying
                    await Task.Delay(delayBetweenRetries);
                }
            }
        }

    }
}