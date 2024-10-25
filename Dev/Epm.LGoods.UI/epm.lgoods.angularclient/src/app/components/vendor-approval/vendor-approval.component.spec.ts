import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { VendorApprovalComponent } from './vendor-approval.component';
import { VendorApprovalService } from '../../services/vendor-approval.service';
import { VendorApproval } from '../../models/vendor-approval';

describe('VendorApprovalComponent', () => {
  let component: VendorApprovalComponent;
  let fixture: ComponentFixture<VendorApprovalComponent>;
  let vendorApprovalService: VendorApprovalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendorApprovalComponent],
      imports: [HttpClientTestingModule],
      providers: [VendorApprovalService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorApprovalComponent);
    component = fixture.componentInstance;
    vendorApprovalService = TestBed.inject(VendorApprovalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pending vendors on init', () => {
    const mockVendors: VendorApproval[] = [
      new VendorApproval(1, 'Vendor 1', 'vendor1@example.com', 'Business 1', new Date(), 'pending'),
      new VendorApproval(2, 'Vendor 2', 'vendor2@example.com', 'Business 2', new Date(), 'pending')
    ];

    spyOn(vendorApprovalService, 'getPendingVendors').and.returnValue(of(mockVendors));

    component.ngOnInit();

    expect(component.pendingVendors.length).toBe(2);
    expect(component.pendingVendors).toEqual(mockVendors);
  });

  it('should handle error while loading pending vendors', () => {
    spyOn(vendorApprovalService, 'getPendingVendors').and.returnValue(throwError('Error'));

    component.ngOnInit();

    expect(component.errorMessage).toBe('Failed to load pending vendors. Please try again.');
  });

  it('should approve vendor', () => {
    const vendor = new VendorApproval(1, 'Vendor 1', 'vendor1@example.com', 'Business 1', new Date(), 'pending');
    spyOn(vendorApprovalService, 'approveVendor').and.returnValue(of({}));

    component.approveVendor(vendor);

    expect(vendor.status).toBe('Approved');
    expect(component.successMessage).toBe('Vendor approved successfully. An email has been sent to the vendor.');
  });

  it('should handle error while approving vendor', () => {
    const vendor = new VendorApproval(1, 'Vendor 1', 'vendor1@example.com', 'Business 1', new Date(), 'pending');
    spyOn(vendorApprovalService, 'approveVendor').and.returnValue(throwError('Error'));

    component.approveVendor(vendor);

    expect(component.errorMessage).toBe('Failed to approve vendor. Please try again.');
  });

  it('should reject vendor', () => {
    const vendor = new VendorApproval(1, 'Vendor 1', 'vendor1@example.com', 'Business 1', new Date(), 'pending');
    spyOn(vendorApprovalService, 'rejectVendor').and.returnValue(of({}));

    component.rejectVendor(vendor);

    expect(vendor.status).toBe('Rejected');
    expect(component.errorMessage).toBe('Vendor rejected successfully. An email has been sent to the vendor.');
  });

  it('should handle error while rejecting vendor', () => {
    const vendor = new VendorApproval(1, 'Vendor 1', 'vendor1@example.com', 'Business 1', new Date(), 'pending');
    spyOn(vendorApprovalService, 'rejectVendor').and.returnValue(throwError('Error'));

    component.rejectVendor(vendor);

    expect(component.errorMessage).toBe('Failed to reject vendor. Please try again.');
  });

  it('should check if a vendor is pending', () => {
    const vendor = new VendorApproval(1, 'Vendor 1', 'vendor1@example.com', 'Business 1', new Date(), 'pending');
    expect(component.isPending(vendor)).toBeTrue();
  });

  it('should check if a vendor is not pending', () => {
    const vendor = new VendorApproval(1, 'Vendor 1', 'vendor1@example.com', 'Business 1', new Date(), 'approved');
    expect(component.isPending(vendor)).toBeFalse();
  });
});
