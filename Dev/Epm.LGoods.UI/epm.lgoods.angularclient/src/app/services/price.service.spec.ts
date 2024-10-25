import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PriceService } from './price.service';
import { Price } from '../models/price.model';
import { HttpErrorResponse } from '@angular/common/http';

describe('PriceService', () => {
  let service: PriceService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5292/api/prices';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PriceService]
    });
    service = TestBed.inject(PriceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a price by ID', () => {
    const mockPrice: Price = {
      priceId: 1,
      currency: 'USD',
      discountPercentage: 10,
      effectivePrice: 90,
      priceAmount: 100,
      productId: 123,
      vendorId: 456
    };

    service.getPriceById(1).subscribe(price => {
      expect(price).toEqual(mockPrice);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPrice);
  });

  it('should handle error when getting a price by ID', () => {
    const errorResponse = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found'
    });

    service.getPriceById(1).subscribe(
      () => fail('expected an error, not prices'),
      error => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    );

    const req = httpMock.expectOne(`${apiUrl}/1`);
    req.flush(null, errorResponse);
  });

  it('should create a new price', () => {
    const newPrice: Price = {
      priceId: 0,
      currency: 'USD',
      discountPercentage: 10,
      effectivePrice: 90,
      priceAmount: 100,
      productId: 123,
      vendorId: 456
    };

    service.createPrice(newPrice).subscribe(price => {
      expect(price).toEqual(newPrice);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newPrice);
  });

  it('should handle error when creating a price', () => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error'
    });

    const newPrice: Price = {
      priceId: 0,
      currency: 'USD',
      discountPercentage: 10,
      effectivePrice: 90,
      priceAmount: 100,
      productId: 123,
      vendorId: 456
    };

    service.createPrice(newPrice).subscribe(
      () => fail('expected an error, not prices'),
      error => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      }
    );

    const req = httpMock.expectOne(apiUrl);
    req.flush(null, errorResponse);
  });

  it('should update an existing price', () => {
    const updatedPrice: Price = {
      priceId: 1,
      currency: 'USD',
      discountPercentage: 15,
      effectivePrice: 85,
      priceAmount: 100,
      productId: 123,
      vendorId: 456
    };

    service.updatePrice(updatedPrice).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });

  it('should handle error when updating a price', () => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error'
    });

    const updatedPrice: Price = {
      priceId: 1,
      currency: 'USD',
      discountPercentage: 15,
      effectivePrice: 85,
      priceAmount: 100,
      productId: 123,
      vendorId: 456
    };

    service.updatePrice(updatedPrice).subscribe(
      () => fail('expected an error, not prices'),
      error => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      }
    );

    const req = httpMock.expectOne(`${apiUrl}/1`);
    req.flush(null, errorResponse);
  });
});
