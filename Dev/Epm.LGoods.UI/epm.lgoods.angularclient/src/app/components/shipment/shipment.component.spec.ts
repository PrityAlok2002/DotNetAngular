import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShipmentComponent } from './shipment.component';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Order } from '../../models/order';

describe('ShipmentComponent', () => {
  let component: ShipmentComponent;
  let fixture: ComponentFixture<ShipmentComponent>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const orderSpy = jasmine.createSpyObj('OrderService', ['getAllOrders']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ShipmentComponent],
      providers: [
        { provide: OrderService, useValue: orderSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    orderServiceSpy = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load shipments on init', () => {
    const mockOrders: Order[] = [
      {
        id: 1,
        customerName: 'John Doe',
        customerPhone: '1234567890',
        orderDate: new Date(),
        orderStatus: 'Shipped',
        totalAmount: 100,
        dateShipped: new Date(),
        dateDelivered: '',
        paymentMethod: 'Credit Card',
        isOptionsOpen: false,
        houseNo: '123',
        building: 'Apt Complex A',
        landmark: 'Near Park',
        addressLabel: 'Home'
      },
      {
        id: 2,
        customerName: 'Jane Smith',
        customerPhone: '0987654321',
        orderDate: new Date(),
        orderStatus: 'Pending',
        totalAmount: 200,
        dateShipped: '',
        dateDelivered: '',
        paymentMethod: 'PayPal',
        isOptionsOpen: false,
        houseNo: '456',
        building: 'Office Tower B',
        landmark: 'Next to Mall',
        addressLabel: 'Work'
      },
      {
        id: 3,
        customerName: 'Bob Johnson',
        customerPhone: '1122334455',
        orderDate: new Date(),
        orderStatus: 'Shipped',
        totalAmount: 300,
        dateShipped: new Date(),
        dateDelivered: '',
        paymentMethod: 'Cash',
        isOptionsOpen: false,
        houseNo: '789',
        building: 'Condo C',
        landmark: 'Opposite School',
        addressLabel: 'Home'
      }
    ];

    orderServiceSpy.getAllOrders.and.returnValue(of(mockOrders));

    fixture.detectChanges(); // This calls ngOnInit

    expect(component.shipments.length).toBe(2);
    expect(component.shipments[0].id).toBe(1);
    expect(component.shipments[1].id).toBe(3);
  });

  it('should handle error when loading shipments', () => {
    const errorMessage = 'Error loading shipments';
    orderServiceSpy.getAllOrders.and.returnValue(throwError(() => new Error(errorMessage)));

    spyOn(console, 'error');

    fixture.detectChanges(); // This calls ngOnInit

    expect(console.error).toHaveBeenCalledWith('Error loading shipments:', jasmine.any(Error));
  });

  it('should filter out orders without dateShipped', () => {
    const mockOrders: Order[] = [
      {
        id: 1,
        customerName: 'John Doe',
        customerPhone: '1234567890',
        orderDate: new Date(),
        orderStatus: 'Shipped',
        totalAmount: 100,
        dateShipped: new Date(),
        dateDelivered: '',
        paymentMethod: 'Credit Card',
        isOptionsOpen: false,
        houseNo: '123',
        building: 'Apt Complex A',
        landmark: 'Near Park',
        addressLabel: 'Home'
      },
      {
        id: 2,
        customerName: 'Jane Smith',
        customerPhone: '0987654321',
        orderDate: new Date(),
        orderStatus: 'Pending',
        totalAmount: 200,
        dateShipped: '',
        dateDelivered: '',
        paymentMethod: 'PayPal',
        isOptionsOpen: false,
        houseNo: '456',
        building: 'Office Tower B',
        landmark: 'Next to Mall',
        addressLabel: 'Work'
      },
      {
        id: 3,
        customerName: 'Bob Johnson',
        customerPhone: '1122334455',
        orderDate: new Date(),
        orderStatus: 'Shipped',
        totalAmount: 300,
        dateShipped: new Date(),
        dateDelivered: '',
        paymentMethod: 'Cash',
        isOptionsOpen: false,
        houseNo: '789',
        building: 'Condo C',
        landmark: 'Opposite School',
        addressLabel: 'Home'
      }
    ];

    orderServiceSpy.getAllOrders.and.returnValue(of(mockOrders));

    component.loadShipments();

    expect(component.shipments.length).toBe(2);
    expect(component.shipments.every(order => order.dateShipped !== '')).toBe(true);
  });
});
