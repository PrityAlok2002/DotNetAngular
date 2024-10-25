using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.IdentityService.Core.Entities
{
    public class VendorDetails
    {
        [Key]
        public int VendorId { get; set; }

        [StringLength(50, ErrorMessage = "Business Name cannot exceed 50 characters")]
        public string BusinessName { get; set; }

        [StringLength(20, ErrorMessage = "City cannot exceed 20 characters")]
        public string City { get; set; }

        [StringLength(20, ErrorMessage = "State cannot exceed 20 characters")]
        public string State { get; set; }

        [RegularExpression(@"^\d{6}$", ErrorMessage = "ZIP Code must be 6 digits")]
        public string Zipcode { get; set; }

        [Required(ErrorMessage = "Status is required")]
        public String Status { get; set; } = "pending";

        public DateTime RegistrationDate { get; set; } = DateTime.Now;
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}

