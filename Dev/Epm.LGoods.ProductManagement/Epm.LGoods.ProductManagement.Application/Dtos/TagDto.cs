using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Application.Dtos
{
    public class TagDto
    {
        [Key]
        public int TagId { get; set; }

        [Required(ErrorMessage = "Tag Name is required")]
        public string TagName { get; set; }

        [Required(ErrorMessage = "Tagged Products is required")]
        [Range(0, int.MaxValue, ErrorMessage = "Tagged Products must be a valid number")]
        public int TaggedProducts { get; set; }

        [Required(ErrorMessage = "Published is required")]
        public bool Published { get; set; }
    }
}
