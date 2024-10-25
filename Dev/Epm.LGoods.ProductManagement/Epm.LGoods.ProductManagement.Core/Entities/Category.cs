using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Core.Entities
{

    namespace Epm.LGoods.ProductManagement.Core.Entities
    {
        public class Category
        {
            [Key]
            public int CategoryId { get; set; }

            [Required(ErrorMessage = "Category Name is required.")]
            [StringLength(50, ErrorMessage = "Category Name cannot exceed 50 characters.")]
            public string CategoryName { get; set; }
            [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
            public string? Description { get; set; }

            public string Image { get; set; }

            public bool IsActive { get; set; } = true;

        }
    }
}
