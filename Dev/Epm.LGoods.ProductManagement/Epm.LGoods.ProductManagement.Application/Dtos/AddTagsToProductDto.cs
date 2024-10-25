using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Application.Dtos
{
    public class AddTagsToProductDto
    {
        public int ProductId { get; set; }
        public List<int> TagIds { get; set; }
    }
}
