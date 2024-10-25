using Epm.LGoods.IdentityService.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.IdentityService.Application.Dtos
{
    public class VendorDetailsDto
    {
        [Key]
        public int VendorId { get; set; }

        [Required(ErrorMessage = "Business Name is required")]
        [StringLength(50, ErrorMessage = "Business Name cannot exceed 50 characters")]
        public string BusinessName { get; set; }

        [Required(ErrorMessage = "City is required")]
        [StringLength(20, ErrorMessage = "City cannot exceed 20 characters")]
        public string City { get; set; }

        [Required(ErrorMessage = "State is required")]
        [StringLength(20, ErrorMessage = "State cannot exceed 20 characters")]
        public string State { get; set; }

        [Required(ErrorMessage = "ZIP Code is required")]
        [RegularExpression(@"^\d{6}$", ErrorMessage = "ZIP Code must be 6 digits")]
        public string Zipcode { get; set; }

        [Required(ErrorMessage = "Status is required")]
        public string Status { get; set; } = "Pending";

        public DateTime RegistrationDate { get; set; } = DateTime.Now;

        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

       
    }

}

