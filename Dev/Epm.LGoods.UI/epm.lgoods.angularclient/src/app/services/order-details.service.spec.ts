import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderDetailsService } from './order-details.service';
import { OrderDetailsDto, ProductDto, ProductImageDto } from '../models/order-detail';
import { environment } from '../../Environments/environments';

describe('OrderDetailsService', () => {
  let service: OrderDetailsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderDetailsService]
    });

    service = TestBed.inject(OrderDetailsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch order details by ID', () => {
    // Mock data with updated structure
    const mockOrder: OrderDetailsDto = {
      id: 1,
      customerName: 'John Doe',
      orderId: 1,
      totalAmount: 100,
      deliveryFee: 5,
      tax: 10,
      discountedPrice: 50,
      orderDate: new Date(),
      orderStatus: 'Pending',
      paymentMethod: 'Credit Card',
      products: [
        {
          productId: 1,
          productName: 'Product A',
          shortDescription: 'Description of Product A',
          quantity: 2,
          costPrice: 25,
          images: [
            {
              imageId: 1,
              imageUrl: 'http://example.com/image1.jpg',
              isMain: true
            }
          ]
        }
      ]
    };

    const orderId = 1;
    const url = `${environment.apiUrlOrderDetails}/${orderId}`;

    service.getOrderDetails(orderId).subscribe((order) => {
      expect(order).toEqual(mockOrder);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrder);
  });

  it('should handle HTTP errors', () => {
    const errorMsg = 'Server Error';

    service.getOrderDetails(1).subscribe({
      next: () => fail('expected an error, not order details'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
        expect(error.message).toContain('Http failure response for');
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrlOrderDetails}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(errorMsg, { status: 500, statusText: 'Server Error' });
  });
});
