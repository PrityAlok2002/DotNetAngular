using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Core.Entities
{
    public class Address
    {
        [Key]
        public int AddressId { get; set; }
        
        public string HouseNo { get; set; }
        public string Building { get; set; }
        public string Landmark { get; set; }
        public string AddressLabel { get; set; }
    }
}
