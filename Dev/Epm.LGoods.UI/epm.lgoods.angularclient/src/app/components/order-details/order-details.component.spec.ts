import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { OrderDetailsComponent } from './order-details.component';
import { OrderDetailsService } from '../../services/order-details.service';
import { OrderDetailsDto, ProductDto, ProductImageDto } from '../../models/order-detail';
import { Router } from '@angular/router';

describe('OrderDetailsComponent', () => {
  let component: OrderDetailsComponent;
  let fixture: ComponentFixture<OrderDetailsComponent>;
  let mockOrderDetailsService: jasmine.SpyObj<OrderDetailsService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const orderDetailsServiceSpy = jasmine.createSpyObj('OrderDetailsService', ['getOrderDetails']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [OrderDetailsComponent],
      providers: [
        { provide: OrderDetailsService, useValue: orderDetailsServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OrderDetailsComponent);
    component = fixture.componentInstance;
    mockOrderDetailsService = TestBed.inject(OrderDetailsService) as jasmine.SpyObj<OrderDetailsService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch order details on initialization', () => {
    // Corrected mock data to include all properties
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

    mockOrderDetailsService.getOrderDetails.and.returnValue(of(mockOrder));

    fixture.detectChanges(); // Trigger ngOnInit

    expect(component.order).toEqual(mockOrder);
    expect(mockOrderDetailsService.getOrderDetails).toHaveBeenCalledWith(1);
  });

  it('should handle error while fetching order details', () => {
    mockOrderDetailsService.getOrderDetails.and.returnValue(throwError(() => new Error('Error fetching data')));

    fixture.detectChanges(); // Trigger ngOnInit

    expect(component.order).toBeNull();
  });

  it('should switch tabs correctly', () => {
    component.selectTab('details');
    expect(component.selectedTab).toBe('details');

    component.selectTab('overview');
    expect(component.selectedTab).toBe('overview');
  });

  it('should get the main image URL for a product', () => {
    const mockProduct: ProductDto = {
      productId: 1,
      productName: 'Product A',
      shortDescription: 'Description A',
      quantity: 2,
      costPrice: 10,
      images: [
        { imageId: 1, imageUrl: 'http://example.com/image1.jpg', isMain: true },
        { imageId: 2, imageUrl: 'http://example.com/image2.jpg', isMain: false }
      ]
    };

    const url = component.getMainImageUrl(mockProduct);
    expect(url).toBe('http://example.com/image1.jpg');
  });

  it('should navigate back to /manage-orders', () => {
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/manage-orders']);
  });
});
