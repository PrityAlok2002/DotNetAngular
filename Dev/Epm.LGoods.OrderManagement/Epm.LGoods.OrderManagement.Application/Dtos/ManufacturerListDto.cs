using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Application.Dtos
{
    public class ManufacturerListDto
    {
        public int ManufacturerId { get; set; }
        public string ManufacturerName { get; set; }
        public bool Published { get; set; }
        public int DisplayOrder { get; set; }
        public string LimitedToVendors { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    }
}

