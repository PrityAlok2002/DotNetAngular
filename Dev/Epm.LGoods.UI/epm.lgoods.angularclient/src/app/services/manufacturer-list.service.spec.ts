import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ManufacturerService } from './manufacturer-list.service';
import { Manufacturer } from '../models/manufacturer-list';
import { environment } from '../../Environments/environments';

describe('ManufacturerService', () => {
  let service: ManufacturerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ManufacturerService]
    });
    service = TestBed.inject(ManufacturerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getManufacturers with correct parameters', () => {
    const mockResponse: Manufacturer[] = [
      {
        manufacturerId: 1,
        manufacturerName: 'Test Manufacturer',
        published: true,
        displayOrder: 1,
        limitedToVendors: 'Vendor1',
        createdOn: new Date()
      }
    ];

    const filter = {
      manufacturerName: 'Test Manufacturer',
      vendor: 'Vendor1'
    };

    service.getManufacturers(filter).subscribe(manufacturers => {
      expect(manufacturers).toEqual(mockResponse);
    });

    const req = httpMock.expectOne({
      method: 'GET',
      url: `${environment.apiUrlManufacturer}?manufacturerName=Test%20Manufacturer&vendor=Vendor1`
    });

    expect(req.request.params.get('manufacturerName')).toBe('Test Manufacturer');
    expect(req.request.params.get('vendor')).toBe('Vendor1');

    req.flush(mockResponse);
  });

  it('should call getManufacturers with no parameters', () => {
    const mockResponse: Manufacturer[] = [
      {
        manufacturerId: 1,
        manufacturerName: 'Test Manufacturer',
        published: true,
        displayOrder: 1,
        limitedToVendors: 'Vendor1',
        createdOn: new Date()
      }
    ];

    service.getManufacturers().subscribe(manufacturers => {
      expect(manufacturers).toEqual(mockResponse);
    });

    const req = httpMock.expectOne({
      method: 'GET',
      url: environment.apiUrlManufacturer
    });

    expect(req.request.params.keys().length).toBe(0);

    req.flush(mockResponse);
  });
});



