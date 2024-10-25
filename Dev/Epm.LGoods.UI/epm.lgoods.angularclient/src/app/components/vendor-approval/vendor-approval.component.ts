// vendor-approval.component.ts
import { Component, OnInit } from '@angular/core';
import { VendorApprovalService } from '../../services/vendor-approval.service';
import { VendorApproval } from '../../models/vendor-approval';
//import { Button } from '@epam/uui';

@Component({
  selector: 'app-vendor-approval',
  templateUrl: './vendor-approval.component.html',
  styleUrls: ['./vendor-approval.component.css']
})
export class VendorApprovalComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  pendingVendors: VendorApproval[] = [];

  constructor(private vendorApprovalService: VendorApprovalService) { }

  ngOnInit(): void {
    this.loadPendingVendors();
  }

  loadPendingVendors(): void {
    this.vendorApprovalService.getPendingVendors()
      .subscribe(
        vendors => this.pendingVendors = vendors,
        error => {
          console.error('Error loading pending vendors:', error);
          this.errorMessage = 'Failed to load pending vendors. Please try again.';
        }
      );
  }

  approveVendor(vendor: VendorApproval): void {
    this.vendorApprovalService.approveVendor(vendor.vendorId)
      .subscribe(
        () => {
          vendor.status = 'Approved';
          this.successMessage = 'Vendor approved successfully. An email has been sent to the vendor.';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error => {
          console.error('Error approving vendor:', error);
          this.errorMessage = 'Failed to approve vendor. Please try again.';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      );
  }

  rejectVendor(vendor: VendorApproval): void {
    this.vendorApprovalService.rejectVendor(vendor.vendorId)
      .subscribe(
        () => {
          vendor.status = 'Rejected';
          this.errorMessage = 'Vendor rejected successfully. An email has been sent to the vendor.';
          setTimeout(() => this.errorMessage = '', 3000);
        },
        error => {
          console.error('Error rejecting vendor:', error);
          this.errorMessage = 'Failed to reject vendor. Please try again.';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      );
  }

  isPending(vendor: VendorApproval): boolean {
    return vendor.status === 'pending';
  }
}
