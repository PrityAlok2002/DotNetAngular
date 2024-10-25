using Epm.LGoods.IdentityService.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.IdentityService.Application.Services
{
    public interface IRegistrationService
    {
        Task RegisterUserAsync(RegistrationDto registrationDto);
        Task<bool> CheckEmailExistsAsync(string email);
    }

}
