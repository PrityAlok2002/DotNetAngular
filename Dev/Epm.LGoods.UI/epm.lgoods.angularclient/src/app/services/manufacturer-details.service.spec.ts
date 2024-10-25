
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ManufacturerDetailsService } from './manufacturer-details.service';
import { ManufacturerDTO } from '../models/ManufacturerDTO';
import { VendorApproval } from '../models/vendor-approval';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('ManufacturerDetailsService', () => {
  let service: ManufacturerDetailsService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5246/api/manufacturer';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ManufacturerDetailsService]
    });

    service = TestBed.inject(ManufacturerDetailsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a manufacturer and return a response', () => {
    const newManufacturer: ManufacturerDTO = {
      manufacturerId: 1,
      manufacturerName: 'New Manufacturer',
      description: 'Description here',
      discounts: 10.5,
      limitedToVendors: [1, 2],
      displayOrder: 1,
      published: true,
      createdOn: new Date().toISOString()
    };

    service.create(newManufacturer).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newManufacturer);
    req.flush({});
  });

  it('should update an existing manufacturer and return a response', () => {
    const id = 1;
    const updatedManufacturer: ManufacturerDTO = {
      manufacturerId: 1,
      manufacturerName: 'Updated Manufacturer',
      description: 'Updated description',
      discounts: 15.0,
      limitedToVendors: [1],
      displayOrder: 2,
      published: false,
      createdOn: new Date().toISOString()
    };

    service.update(id, updatedManufacturer).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedManufacturer);
    req.flush({});
  });

  it('should fetch vendors and return an array of VendorApproval', () => {
    const mockVendors: VendorApproval[] = [
      {
        vendorId: 1,
        vendorName: 'Vendor 1',
        vendorEmail: 'vendor1@example.com',
        businessName: 'Business 1',
        registrationDate: new Date(),
        status: 'Active',
        formattedRegistrationDate: '',
        isPending: function (): boolean {
          throw new Error('Function not implemented.');
        },
        isApproved: function (): boolean {
          throw new Error('Function not implemented.');
        }
      },
      {
        vendorId: 2,
        vendorName: 'Vendor 2',
        vendorEmail: 'vendor2@example.com',
        businessName: 'Business 2',
        registrationDate: new Date(),
        status: 'Inactive',
        formattedRegistrationDate: '',
        isPending: function (): boolean {
          throw new Error('Function not implemented.');
        },
        isApproved: function (): boolean {
          throw new Error('Function not implemented.');
        }
      }
    ];

    service.getVendors().subscribe(vendors => {
      expect(vendors.length).toBe(2);
      expect(vendors).toEqual(mockVendors);
    });

    const req = httpMock.expectOne(`${apiUrl}/vendors`);
    expect(req.request.method).toBe('GET');
    req.flush(mockVendors);
  });

  it('should handle error response when creating a manufacturer', () => {
    const newManufacturer: ManufacturerDTO = {
      manufacturerId: 1,
      manufacturerName: 'New Manufacturer',
      description: 'Description here',
      discounts: 10.5,
      limitedToVendors: [1, 2],
      displayOrder: 1,
      published: true,
      createdOn: new Date().toISOString()
    };

    service.create(newManufacturer).subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      }
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush('Server error', { status: 500, statusText: 'Server Error' });
  });

  it('should handle error response when updating a manufacturer', () => {
    const id = 1;
    const updatedManufacturer: ManufacturerDTO = {
      manufacturerId: 1,
      manufacturerName: 'Updated Manufacturer',
      description: 'Updated description',
      discounts: 15.0,
      limitedToVendors: [1],
      displayOrder: 2,
      published: false,
      createdOn: new Date().toISOString()
    };

    service.update(id, updatedManufacturer).subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('PUT');
    req.flush('Server error', { status: 500, statusText: 'Server Error' });
  });

  it('should handle empty vendor list response', () => {
    service.getVendors().subscribe(vendors => {
      expect(vendors.length).toBe(0);
      expect(vendors).toEqual([]);
    });

    const req = httpMock.expectOne(`${apiUrl}/vendors`);
    expect(req.request.method).toBe('GET');
    req.flush([]); // Return an empty array
  });

  it('should handle unexpected response format when fetching vendors', () => {
    const unexpectedResponse: any = { message: 'Unexpected format' };

    service.getVendors().subscribe({
      next: () => fail('should have failed with unexpected response format'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/vendors`);
    expect(req.request.method).toBe('GET');
    req.flush(unexpectedResponse, { status: 500, statusText: 'Server Error' });
  });

  it('should handle missing API URL when creating a manufacturer', () => {
    const newManufacturer: ManufacturerDTO = {
      manufacturerId: 1,
      manufacturerName: 'New Manufacturer',
      description: 'Description here',
      discounts: 10.5,
      limitedToVendors: [1, 2],
      displayOrder: 1,
      published: true,
      createdOn: new Date().toISOString()
    };

    service = TestBed.inject(ManufacturerDetailsService);
    spyOn(service, 'create').and.callFake(() => {
      return new Observable(observer => {
        observer.error(new Error('API URL is missing'));
      });
    });

    service.create(newManufacturer).subscribe({
      next: () => fail('should have failed with API URL error'),
      error: (error) => {
        expect(error.message).toContain('API URL is missing');
      }
    });
  });

  it('should handle invalid API responses gracefully', () => {
    const invalidResponse: any = { invalid: 'response' };

    service.getVendors().subscribe({
      next: () => fail('should have failed with invalid API response'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/vendors`);
    expect(req.request.method).toBe('GET');
    req.flush(invalidResponse, { status: 400, statusText: 'Bad Request' });
  });



  it('should handle 401 Unauthorized error when creating a manufacturer', () => {
    const newManufacturer: ManufacturerDTO = {
      manufacturerId: 1,
      manufacturerName: 'New Manufacturer',
      description: 'Description here',
      discounts: 10.5,
      limitedToVendors: [1, 2],
      displayOrder: 1,
      published: true,
      createdOn: new Date().toISOString()
    };

    service.create(newManufacturer).subscribe({
      next: () => fail('should have failed with 401 Unauthorized error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(401);
        expect(error.error).toBe('Unauthorized');
      }
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });


  it('should handle 400 Bad Request error when updating a manufacturer', () => {
    const id = 1;
    const updatedManufacturer: ManufacturerDTO = {
      manufacturerId: 1,
      manufacturerName: 'Updated Manufacturer',
      description: 'Updated description',
      discounts: 15.0,
      limitedToVendors: [1],
      displayOrder: 2,
      published: false,
      createdOn: new Date().toISOString()
    };

    service.update(id, updatedManufacturer).subscribe({
      next: () => fail('should have failed with 400 Bad Request error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(400);
        expect(error.error).toBe('Bad Request');
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('PUT');
    req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
  });

  it('should handle unexpected data format when fetching vendors', () => {
    const unexpectedData = { unexpected: 'data' }; // Unexpected format

    service.getVendors().subscribe({
      next: () => fail('should have failed with unexpected data format'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/vendors`);
    expect(req.request.method).toBe('GET');
    req.flush(unexpectedData, { status: 500, statusText: 'Server Error' });
  });

  it('should handle empty vendor array response', () => {
    service.getVendors().subscribe(vendors => {
      expect(vendors.length).toBe(0);
      expect(vendors).toEqual([]);
    });

    const req = httpMock.expectOne(`${apiUrl}/vendors`);
    expect(req.request.method).toBe('GET');
    req.flush([]); // Return an empty array
  });


  it('should handle non-JSON response when fetching vendors', () => {
    const nonJsonResponse = 'This is a plain text response';

    service.getVendors().subscribe({
      next: () => fail('should have failed with non-JSON response'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/vendors`);
    expect(req.request.method).toBe('GET');
    req.flush(nonJsonResponse, { status: 500, statusText: 'Server Error' });
  });




});


