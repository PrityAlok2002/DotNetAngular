import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { Order } from '../models/order';
import { environment } from '../../Environments/environments';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService]
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all orders', () => {
    const mockOrders: Order[] = [
      {
        id: 1,
        customerName: 'John Doe',
        customerPhone: '1234567890',
        orderDate: new Date('2023-08-01'),
        orderStatus: 'pending',
        totalAmount: 100,
        isOptionsOpen: false,
        paymentMethod: 'credit card',
        dateShipped: new Date('2023-08-03'),
        dateDelivered: new Date('2023-08-04'),
        houseNo: '123',
        building: 'Apt Complex',
        landmark: 'Near Park',
        addressLabel: 'Home'
      },
      {
        id: 2,
        customerName: 'Jane Smith',
        customerPhone: '0987654321',
        orderDate: new Date('2023-08-02'),
        orderStatus: 'completed',
        totalAmount: 150,
        isOptionsOpen: false,
        paymentMethod: 'cash',
        dateShipped: new Date('2023-08-03'),
        dateDelivered: new Date('2023-08-04'),
        houseNo: '456',
        building: 'Office Building',
        landmark: 'Downtown',
        addressLabel: 'Work'
      }
    ];

    service.getAllOrders().subscribe(orders => {
      expect(orders.length).toBe(2);
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('should update order status', () => {
    const orderId = 1;
    const newStatus = 'completed';

    service.updateOrderStatus(orderId, newStatus).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/${orderId}/status`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ orderId, newStatus });
    req.flush({ success: true });
  });
});
