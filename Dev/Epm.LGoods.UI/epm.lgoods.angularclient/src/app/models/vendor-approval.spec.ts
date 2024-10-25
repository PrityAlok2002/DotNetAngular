import { VendorApproval } from './vendor-approval';

describe('VendorApproval', () => {
  const mockVendorId = 1;
  const mockVendorName = 'Vendor Name';
  const mockVendorEmail = 'vendor@example.com';
  const mockBusinessName = 'Business Name';
  const mockRegistrationDate = new Date('2022-01-01'); // Setting a specific date for consistency in tests
  const mockStatus = 'Approved';

  it('should create an instance', () => {
    const vendorApproval = new VendorApproval(
      mockVendorId,
      mockVendorName,
      mockVendorEmail,
      mockBusinessName,
      mockRegistrationDate,
      mockStatus
    );

    expect(vendorApproval).toBeTruthy();
  });

  it('should return formatted registration date', () => {
    const vendorApproval = new VendorApproval(
      mockVendorId,
      mockVendorName,
      mockVendorEmail,
      mockBusinessName,
      mockRegistrationDate,
      mockStatus
    );

    expect(vendorApproval.formattedRegistrationDate).toBe('1/1/2022'); // Adjust the date format based on your locale
  });

  it('should return true for isPending when status is pending', () => {
    const vendorApproval = new VendorApproval(
      mockVendorId,
      mockVendorName,
      mockVendorEmail,
      mockBusinessName,
      mockRegistrationDate,
      'pending'
    );

    expect(vendorApproval.isPending()).toBeTrue();
  });

  it('should return false for isPending when status is not pending', () => {
    const vendorApproval = new VendorApproval(
      mockVendorId,
      mockVendorName,
      mockVendorEmail,
      mockBusinessName,
      mockRegistrationDate,
      mockStatus
    );

    expect(vendorApproval.isPending()).toBeFalse();
  });

  it('should return true for isApproved when status is approved', () => {
    const vendorApproval = new VendorApproval(
      mockVendorId,
      mockVendorName,
      mockVendorEmail,
      mockBusinessName,
      mockRegistrationDate,
      'approved'
    );

    expect(vendorApproval.isApproved()).toBeTrue();
  });

  it('should return false for isApproved when status is not approved', () => {
    const vendorApproval = new VendorApproval(
      mockVendorId,
      mockVendorName,
      mockVendorEmail,
      mockBusinessName,
      mockRegistrationDate,
      'pending'
    );

    expect(vendorApproval.isApproved()).toBeFalse();
  });
});
