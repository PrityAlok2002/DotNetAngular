using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Epm.LGoods.IdentityService.Core.Entities;

namespace Epm.LGoods.OrderManagement.Core.Entities
{
    public class ManufacturerDetails
    {
        [Key]
        public int ManufacturerId { get; set; }

        [Required]
        [RegularExpression("^[A-Z][a-zA-Z]*$", ErrorMessage = "Name must start with a capital letter and contain only alphabets without any numbers or special characters.")]
        [MaxLength(30, ErrorMessage = "Name cannot exceed 30 characters.")]
        public string ManufacturerName { get; set; }

        [Required]
        [MaxLength(300, ErrorMessage = "Description cannot exceed 300 characters.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Discounts is required.")]
        [Range(0, 100, ErrorMessage = "Discounts must be between 0 and 100.")]
        public decimal Discounts { get; set; } 

        [Required(ErrorMessage = "Display order is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "Display order must be a positive number.")]
        public int DisplayOrder { get; set; }

        [Required(ErrorMessage = "Limited to Vendors is required.")]
        public string LimitedToVendors { get; set; }

        [Required(ErrorMessage = "Published status is required.")]
        public bool Published { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow; 

        //// Foreign key property (not mapped to the database table)
        //[NotMapped]
        //public int? VendorId { get; set; } // Nullable to indicate it's optional


        // Foreign key property
        public int? VendorId { get; set; }

        // Navigation property
        [ForeignKey("VendorId")]
        public VendorDetails Vendor { get; set; }

       
    }
}
