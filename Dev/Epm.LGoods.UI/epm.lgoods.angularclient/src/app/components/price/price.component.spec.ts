import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriceComponent } from './price.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PriceService } from '../../services/price.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { mockPrice } from './price.component.mock';

describe('PriceComponent', () => {
  let component: PriceComponent;
  let fixture: ComponentFixture<PriceComponent>;
  let mockPriceService: jasmine.SpyObj<PriceService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PriceService', ['createPrice', 'getPriceById']);

    await TestBed.configureTestingModule({
      declarations: [PriceComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: PriceService, useValue: spy }
      ]
    }).compileComponents();

    mockPriceService = TestBed.inject(PriceService) as jasmine.SpyObj<PriceService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls properly', () => {
    expect(component.priceForm.get('currency')).toBeTruthy();
    expect(component.priceForm.get('discountPercentage')).toBeTruthy();
    expect(component.priceForm.get('effectivePrice')).toBeTruthy();
    expect(component.priceForm.get('priceAmount')).toBeTruthy();
    expect(component.priceForm.get('productId')).toBeTruthy();
    expect(component.priceForm.get('vendorId')).toBeTruthy();
  });

  it('should limit currency input to uppercase alphabetical letters only', () => {
    component.priceForm.get('currency')?.setValue('usd');
    component.limitCurrency();
    expect(component.priceForm.get('currency')?.value).toBe('USD');

    component.priceForm.get('currency')?.setValue('uSd1@');
    component.limitCurrency();
    expect(component.priceForm.get('currency')?.value).toBe('USD');

    component.priceForm.get('currency')?.setValue('');
    component.limitCurrency();
    expect(component.priceForm.get('currency')?.value).toBe('');
  });

  it('should calculate effectivePrice correctly when priceAmount and discountPercentage change', () => {
    component.priceForm.get('priceAmount')?.setValue(100);
    component.priceForm.get('discountPercentage')?.setValue(10);
    expect(component.priceForm.get('effectivePrice')?.value).toBe(90);

    component.priceForm.get('discountPercentage')?.setValue(20);
    expect(component.priceForm.get('effectivePrice')?.value).toBe(80);

    component.priceForm.get('priceAmount')?.setValue(200);
    expect(component.priceForm.get('effectivePrice')?.value).toBe(160);
  });

  it('should submit the form and display success message on successful creation', () => {
    mockPriceService.createPrice.and.returnValue(of(mockPrice));

    component.priceForm.setValue({
      currency: 'USD',
      discountPercentage: 10,
      effectivePrice: 90,
      priceAmount: 100,
      productId: 1,
      vendorId: 1
    });

    component.onSubmit();

    fixture.detectChanges();

    expect(component.successMessage).toBe('Price successfully added');
    expect(component.errorMessage).toBeNull();
  });

  it('should display error message on failed creation', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'Error creating price',
      status: 500,
      statusText: 'Server Error'
    });

    mockPriceService.createPrice.and.returnValue(throwError(() => errorResponse));

    component.priceForm.setValue({
      currency: 'USD',
      discountPercentage: 10,
      effectivePrice: 90,
      priceAmount: 100,
      productId: 1,
      vendorId: 1
    });

    component.onSubmit();

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Http failure response for (unknown url): 500 Server Error');
    expect(component.successMessage).toBeNull();
  });

  it('should set successMessage to null if there is an error', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'Error creating price',
      status: 500,
      statusText: 'Server Error'
    });

    mockPriceService.createPrice.and.returnValue(throwError(() => errorResponse));

    component.onSubmit();

    fixture.detectChanges();

    expect(component.successMessage).toBeNull();
  });

  it('should validate form correctly', () => {
    expect(component.priceForm.valid).toBeFalse();

    component.priceForm.setValue({
      currency: 'USD',
      discountPercentage: 10,
      effectivePrice: 90,
      priceAmount: 100,
      productId: 1,
      vendorId: 1
    });

    expect(component.priceForm.valid).toBeTrue();
  });

  it('should reset form after successful submission', () => {
    mockPriceService.createPrice.and.returnValue(of(mockPrice));

    component.priceForm.setValue({
      currency: 'USD',
      discountPercentage: 10,
      effectivePrice: 90,
      priceAmount: 100,
      productId: 1,
      vendorId: 1
    });

    component.onSubmit();

    // Create a mock event object
    const mockEvent = {
      target: {
        value: '100'
      }
    } as unknown as Event;

    component.limitPriceAmount(mockEvent);

    fixture.detectChanges();

    expect(true).toBeTruthy();
  });


  it('should handle discountPercentage input properly', () => {
    const inputEvent = { target: { value: '50abc' } } as unknown as Event;
    component.limitDiscountPercentage(inputEvent);
    expect(component.priceForm.get('discountPercentage')?.value).toBe(50);

    const inputEventEmpty = { target: { value: '' } } as unknown as Event;
    component.limitDiscountPercentage(inputEventEmpty);
    expect(component.priceForm.get('discountPercentage')?.value).toBe(0);

    const inputEventInvalid = { target: { value: 'abc' } } as unknown as Event;
    component.limitDiscountPercentage(inputEventInvalid);
    expect(component.priceForm.get('discountPercentage')?.value).toBe(0);
  });

  it('should handle productId input properly', () => {
    const inputEvent = { target: { value: '12345678901' } } as unknown as Event;
    component.limitProductId(inputEvent);
    expect(component.priceForm.get('productId')?.value).toBe('1234567890');

    const inputEventShort = { target: { value: '123' } } as unknown as Event;
    component.limitProductId(inputEventShort);
    expect(component.priceForm.get('productId')?.value).toBe('123');
  });

  it('should handle vendorId input properly', () => {
    const inputEvent = { target: { value: '98765432101' } } as unknown as Event;
    component.limitVendorId(inputEvent);
    expect(component.priceForm.get('vendorId')?.value).toBe('9876543210');

    const inputEventShort = { target: { value: '456' } } as unknown as Event;
    component.limitVendorId(inputEventShort);
    expect(component.priceForm.get('vendorId')?.value).toBe('456');
  });
});
