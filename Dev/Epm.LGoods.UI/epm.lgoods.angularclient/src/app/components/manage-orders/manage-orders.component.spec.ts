import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageOrdersComponent } from './manage-orders.component';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Order } from '../../models/order';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('ManageOrdersComponent', () => {
  let component: ManageOrdersComponent;
  let fixture: ComponentFixture<ManageOrdersComponent>;
  let orderService: OrderService;
  let toastrService: ToastrService;

  const mockOrders: Order[] = [
    {
      id: 1,
      customerName: 'John Doe',
      customerPhone: '1234567890',
      orderDate: new Date(),
      orderStatus: 'Pending',
      totalAmount: 100,
      isOptionsOpen: false,
      paymentMethod: 'Credit Card',
      dateShipped: new Date(),
      dateDelivered: new Date(),
      houseNo: '123',
      building: 'ABC Apartments',
      landmark: 'Near Park',
      addressLabel: 'Home'
    },
    // Add more mock orders as needed
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrdersComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, ToastrModule.forRoot()],
      providers: [OrderService, ToastrService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ManageOrdersComponent);
    component = fixture.componentInstance;
    orderService = TestBed.inject(OrderService);
    toastrService = TestBed.inject(ToastrService);

    spyOn(toastrService, 'success');
    spyOn(toastrService, 'error');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch orders on init', () => {
    spyOn(orderService, 'getAllOrders').and.returnValue(of(mockOrders));
    fixture.detectChanges();
    expect(orderService.getAllOrders).toHaveBeenCalled();
    expect(component.orders).toEqual(mockOrders);
  });

  it('should handle error when fetching orders', () => {
    spyOn(console, 'error');
    spyOn(orderService, 'getAllOrders').and.returnValue(throwError('Error'));
    component.fetchOrders();
    expect(console.error).toHaveBeenCalledWith('Error fetching orders:', 'Error');
    expect(toastrService.error).toHaveBeenCalledWith('Failed to fetch orders', 'Error');
  });

  it('should toggle sort options', () => {
    expect(component.isSortOptionsOpen).toBeFalse();
    component.toggleSortOptions();
    expect(component.isSortOptionsOpen).toBeTrue();
  });

  it('should sort orders', () => {
    const unsortedOrders: Order[] = [
      { ...mockOrders[0], orderStatus: 'Shipped' },
      { ...mockOrders[0], orderStatus: 'Pending' },
      { ...mockOrders[0], orderStatus: 'Delivered' }
    ];
    component.orders = unsortedOrders;
    component.sortOrders('Pending');
    expect(component.orders[0].orderStatus).toBe('Pending');
    expect(component.isSortOptionsOpen).toBeFalse();
  });

  it('should update paginated orders', () => {
    component.orders = [
      ...mockOrders,
      { ...mockOrders[0], id: 2 },
      { ...mockOrders[0], id: 3 },
      { ...mockOrders[0], id: 4 },
      { ...mockOrders[0], id: 5 },
      { ...mockOrders[0], id: 6 }
    ];
    component.itemsPerPage = 5;
    component.updatePaginatedOrders();
    expect(component.paginatedOrders.length).toBe(5);
  });

  it('should toggle options for an order', () => {
    const order = { ...mockOrders[0], isOptionsOpen: false };
    component.toggleOptions(order);
    expect(order.isOptionsOpen).toBeTrue();
  });

  it('should update order status and show success toastr', () => {
    spyOn(orderService, 'updateOrderStatus').and.returnValue(of({}));
    const order = mockOrders[0];
    component.updateOrderStatus(order, 'Completed');
    expect(orderService.updateOrderStatus).toHaveBeenCalledWith(order.id, 'Completed');
    expect(toastrService.success).toHaveBeenCalledWith(`Order ${order.id} successfully completed.`, 'Success');
  });

  it('should update order status to Cancelled and show error toastr', () => {
    spyOn(orderService, 'updateOrderStatus').and.returnValue(of({}));
    const order = mockOrders[0];
    component.updateOrderStatus(order, 'Cancelled');
    expect(orderService.updateOrderStatus).toHaveBeenCalledWith(order.id, 'Cancelled');
    expect(toastrService.error).toHaveBeenCalledWith(`Order ${order.id} has been cancelled.`, 'Order Cancelled');
  });

  it('should handle error when updating order status', () => {
    spyOn(console, 'error');
    spyOn(orderService, 'updateOrderStatus').and.returnValue(throwError('Error'));
    const order = mockOrders[0];
    component.updateOrderStatus(order, 'Completed');
    expect(console.error).toHaveBeenCalledWith('Error updating order status:', 'Error');
    expect(toastrService.error).toHaveBeenCalledWith('Failed to update order status', 'Error');
  });

  describe('isActionDisabled', () => {
    let order: Order;

    beforeEach(() => {
      order = { ...mockOrders[0] };
    });

    it('should disable "Complete" action if order status is not "Delivered"', () => {
      order.orderStatus = 'Pending';
      expect(component.isActionDisabled(order, 'Complete')).toBeTrue();
      order.orderStatus = 'Delivered';
      expect(component.isActionDisabled(order, 'Complete')).toBeFalse();
    });

    it('should disable "Cancel" action for certain statuses', () => {
      ['Delivered', 'Cancelled', 'Shipped', 'Completed'].forEach(status => {
        order.orderStatus = status;
        expect(component.isActionDisabled(order, 'Cancel')).toBeTrue();
      });
      order.orderStatus = 'Pending';
      expect(component.isActionDisabled(order, 'Cancel')).toBeFalse();
    });

    it('should disable "Ship" action if order status is not "Pending"', () => {
      order.orderStatus = 'Pending';
      expect(component.isActionDisabled(order, 'Ship')).toBeFalse();
      order.orderStatus = 'Shipped';
      expect(component.isActionDisabled(order, 'Ship')).toBeTrue();
    });

    it('should disable "Deliver" action if order status is not "Shipped"', () => {
      order.orderStatus = 'Shipped';
      expect(component.isActionDisabled(order, 'Deliver')).toBeFalse();
      order.orderStatus = 'Pending';
      expect(component.isActionDisabled(order, 'Deliver')).toBeTrue();
    });
  });

  it('should navigate to previous page', () => {
    component.currentPage = 2;
    component.previousPage();
    expect(component.currentPage).toBe(1);
  });

  it('should navigate to next page', () => {
    component.currentPage = 1;
    component.totalPages = 2;
    component.nextPage();
    expect(component.currentPage).toBe(2);
  });

  it('should change items per page', () => {
    const event = { target: { value: '10' } } as unknown as Event;
    component.orders = [...Array(20)].map((_, i) => ({ ...mockOrders[0], id: i + 1 }));
    component.changeItemsPerPage(event);
    expect(component.itemsPerPage).toBe(10);
    expect(component.totalPages).toBe(2);
    expect(component.currentPage).toBe(1);
  });
});
