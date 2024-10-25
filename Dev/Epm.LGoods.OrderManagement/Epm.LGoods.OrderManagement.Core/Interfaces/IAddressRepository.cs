using Epm.LGoods.OrderManagement.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Core.Interfaces
{
    public interface IAddressRepository
    {
        Task<Address> GetByIdAsync(int id);
    }
}
