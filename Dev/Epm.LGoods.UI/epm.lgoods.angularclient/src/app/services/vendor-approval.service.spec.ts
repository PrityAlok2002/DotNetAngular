import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VendorApprovalService } from './vendor-approval.service';
import { VendorApproval } from '../models/vendor-approval';

describe('VendorApprovalService', () => {
  let service: VendorApprovalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VendorApprovalService]
    });

    service = TestBed.inject(VendorApprovalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPendingVendors', () => {
    it('should return an array of VendorApproval', () => {
      const mockVendors = [
        {
          vendorId: 1,
          vendorName: 'Vendor 1',
          vendorEmail: 'vendor1@example.com',
          businessName: 'Business 1',
          registrationDate: '2024-01-01T00:00:00Z',
          status: 'pending'
        },
        {
          vendorId: 2,
          vendorName: 'Vendor 2',
          vendorEmail: 'vendor2@example.com',
          businessName: 'Business 2',
          registrationDate: '2024-02-01T00:00:00Z',
          status: 'pending'
        }
      ];

      service.getPendingVendors().subscribe(vendors => {
        expect(vendors.length).toBe(2);
        expect(vendors[0] instanceof VendorApproval).toBeTrue();
        expect(vendors[0].vendorName).toBe('Vendor 1');
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/pending`);
      expect(req.request.method).toBe('GET');
      req.flush(mockVendors);
    });
  });

  describe('approveVendor', () => {
    it('should send a PUT request to approve a vendor', () => {
      const vendorId = 1;

      service.approveVendor(vendorId).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/${vendorId}/approve`);
      expect(req.request.method).toBe('PUT');
      req.flush({});
    });
  });

  describe('rejectVendor', () => {
    it('should send a PUT request to reject a vendor', () => {
      const vendorId = 2;

      service.rejectVendor(vendorId).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/${vendorId}/reject`);
      expect(req.request.method).toBe('PUT');
      req.flush({});
    });
  });
});
