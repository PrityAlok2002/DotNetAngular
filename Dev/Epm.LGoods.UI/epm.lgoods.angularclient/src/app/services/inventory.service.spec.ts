import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InventoryService } from './inventory.service';
import { environment } from '../../Environments/environments';
import { Inventory } from '../models/Inventory';

describe('InventoryService', () => {
  let service: InventoryService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrlInventory;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InventoryService]
    });

    service = TestBed.inject(InventoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#createInventory', () => {
    //  it('should send a POST request to the API and return the created inventory', () => {
    //    const mockInventory: Inventory = {
    //      inventoryId: 1,
    //      productId: 123,
    //      minimumCartQuantity: 10,
    //      maximumCartQuantity: 20,
    //      quantityStep: 5
    //    };

    //    const response: Inventory = { ...mockInventory, inventoryId: 2 };

    //    service.createInventory(mockInventory).subscribe((data) => {
    //      expect(data).toEqual(response);
    //    });

    //    const req = httpMock.expectOne(`${apiUrl}/update`);
    //    expect(req.request.method).toBe('POST');
    //    expect(req.request.body).toEqual(mockInventory);
    //    req.flush(response);
    //  });

    it('should handle errors from the API', () => {
      const mockInventory: Inventory = {
        inventoryId: 1,
        productId: 123,
        minimumCartQuantity: 10,
        maximumCartQuantity: 20,
        quantityStep: 5
      };

      const errorMessage = 'Failed to create inventory';

      service.createInventory(mockInventory).subscribe({
        next: () => fail('Expected an error, but the call succeeded'),
        error: (error) => {
          expect(error.error).toContain(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/update`);
      expect(req.request.method).toBe('POST');
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });

    it('should handle empty inventory object', () => {
      const mockInventory: Inventory = {
        inventoryId: 0,
        productId: 0,
        minimumCartQuantity: 0,
        maximumCartQuantity: 0,
        quantityStep: 0
      };

      const response: Inventory = { ...mockInventory, inventoryId: 3 };

      service.createInventory(mockInventory).subscribe((data) => {
        expect(data).toEqual(response);
      });

      const req = httpMock.expectOne(`${apiUrl}/update`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockInventory);
      req.flush(response);
    });

   
  });
});
