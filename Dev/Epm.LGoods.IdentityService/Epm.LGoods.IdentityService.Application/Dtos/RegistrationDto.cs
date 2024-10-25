using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.IdentityService.Application.Dtos
{
    public class RegistrationDto
    {
        [Required]
        [StringLength(20, MinimumLength = 3)]
        [RegularExpression("^[a-zA-Z]+$")]
        public string FirstName { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 3)]
        [RegularExpression("^[a-zA-Z]+$")]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 8)]
        [RegularExpression("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")]
        public string Password { get; set; }

        [Required]
        [RegularExpression("^[6789]\\d{9}$")]
        public string MobileNumber { get; set; }

        [Required]
        [RegularExpression("^(Admin|Vendor)$")]
        public string AccountType { get; set; }

        [StringLength(20)]
        public string? BusinessName { get; set; }

        [StringLength(20)]
        public string? City { get; set; }

        [StringLength(20)]
        public string? State { get; set; }

        [RegularExpression("^[0-9]{6}$")]
        public string? ZipCode { get; set; }
    }
}
