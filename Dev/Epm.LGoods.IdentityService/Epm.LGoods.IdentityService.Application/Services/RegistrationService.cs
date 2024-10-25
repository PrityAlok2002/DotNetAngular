using Epm.LGoods.IdentityService.Application.Dtos;
using Epm.LGoods.IdentityService.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.IdentityService.Application.Services
{
    public class RegistrationService : IRegistrationService
    {
        private readonly ApplicationDbContext _context;

        public RegistrationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task RegisterUserAsync(RegistrationDto registrationDto)
        {
            var user = new User
            {
                FirstName = registrationDto.FirstName,
                LastName = registrationDto.LastName,
                Email = registrationDto.Email,
                Password = registrationDto.Password, 
                MobileNumber = registrationDto.MobileNumber,
                AccountType = registrationDto.AccountType
            };

           
            _context.Users.Add(user);
            await _context.SaveChangesAsync();


            if (registrationDto.AccountType == "Vendor")
            {
                var vendorDetails = new VendorDetails
                {
                    BusinessName = registrationDto.BusinessName,
                    City = registrationDto.City,
                    State = registrationDto.State,
                    Zipcode = registrationDto.ZipCode,
                    Status = "pending",
                    UserId = user.UserId,
                    RegistrationDate = DateTime.UtcNow
                };

                _context.VendorDetails.Add(vendorDetails);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> CheckEmailExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }
    }
}
