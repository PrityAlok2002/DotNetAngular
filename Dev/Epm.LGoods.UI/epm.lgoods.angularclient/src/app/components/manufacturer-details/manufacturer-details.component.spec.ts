
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs'; import { MatSnackBar } from '@angular/material/snack-bar';

import { ManufacturerDetailsService } from '../../services/manufacturer-details.service';
import { ManufacturerDetailsComponent } from './manufacturer-details.component';
import { VendorApproval } from '../../models/vendor-approval';
import { ManufacturerDTO } from '../../models/ManufacturerDTO';

describe('ManufacturerDetailsComponent', () => {
  let component: ManufacturerDetailsComponent;
  let fixture: ComponentFixture<ManufacturerDetailsComponent>;
  let mockService: jasmine.SpyObj<ManufacturerDetailsService>;
  let router: Router;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('ManufacturerDetailsService', ['getVendors', 'update', 'create']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ManufacturerDetailsComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ManufacturerDetailsService, useValue: serviceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManufacturerDetailsComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(ManufacturerDetailsService) as jasmine.SpyObj<ManufacturerDetailsService>;
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    mockService.getVendors.and.returnValue(of([new VendorApproval(1, 'Test Vendor', 'test@vendor.com', 'Test Business', new Date('2021-01-01'), 'Active')]));
    mockService.update.and.returnValue(of({}));
    mockService.create.and.returnValue(of({}));

    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initializes the manufacturerForm with correct validations', () => {
    const manufacturerNameControl = component.manufacturerForm.get('manufacturerName');
    if (!manufacturerNameControl) {
      throw new Error('Manufacturer name control is not available');
    }
    expect(manufacturerNameControl.errors).toEqual({ required: true });
  });

  it('loads vendors and their properties on init', () => {
    expect(mockService.getVendors).toHaveBeenCalled();
    expect(component.vendors.length).toBe(1);
    expect(component.vendors[0].vendorName).toBe('Test Vendor');
  });

  //it('shows an error message if form is invalid on submit', () => {
  //  component.manufacturerForm.patchValue({
  //    manufacturerName: '',
  //    discounts: '',
  //    displayOrder: '',
  //    limitedToVendors: [],
  //    published: false
  //  });

  //  component.onSubmit();

  //  expect(snackBar.open).toHaveBeenCalledWith('Please fix the errors in the form.', 'Close', {
  //    duration: 3000,
  //    verticalPosition: 'top',
  //    horizontalPosition: 'right',
  //  });
  //});

  it('should handle invalid input format in onDiscountsChange', () => {
    const inputs = new Event('input', {
      bubbles: true,
      cancelable: true
    });
    Object.defineProperty(inputs, 'target', { value: { value: 'invalid' }, configurable: true });

    component.onDiscountsChange(inputs);
    const discountsControl = component.manufacturerForm.get('discounts');
    if (discountsControl) {
      expect(discountsControl.value).toBe('');
    } else {
      fail('Discounts control is not available');
    }
  });

  it('should capitalize the first letter of each word in manufacturerName', () => {
    const control = component.manufacturerForm.get('manufacturerName');
    control?.setValue('test manufacturer');
    component.capitalizeFirstLetter();
    expect(control?.value).toBe('Test Manufacturer');
  });

  it('should not modify the value if manufacturerName is empty', () => {
    const control = component.manufacturerForm.get('manufacturerName');
    control?.setValue('');
    component.capitalizeFirstLetter();
    expect(control?.value).toBe('');
  });

  it('should capitalize the first letter of a single word', () => {
    const control = component.manufacturerForm.get('manufacturerName');
    control?.setValue('test');
    component.capitalizeFirstLetter();
    expect(control?.value).toBe('Test');
  });

  it('should remove special characters and keep only alphabets and spaces', () => {
    const control = component.manufacturerForm.get('manufacturerName');
    const event = { target: { value: 'Test@Name123!' } } as unknown as Event;
    component.onInputChange(event);
    expect(control?.value).toBe('TestName');
  });

  it('should handle empty input correctly', () => {
    const control = component.manufacturerForm.get('manufacturerName');
    const event = { target: { value: '' } } as unknown as Event;
    component.onInputChange(event);
    expect(control?.value).toBe('');
  });

  it('should remove numbers from the manufacturerName', () => {
    const control = component.manufacturerForm.get('manufacturerName');
    const event = { target: { value: 'Test123Name' } } as unknown as Event;
    component.onInputChange(event);
    expect(control?.value).toBe('TestName');
  });

  it('should update displayOrder form control with valid input', () => {
    const inputEvent = {
      target: {
        value: '50'
      }
    } as unknown as Event;

    component.onDisplayOrderChange(inputEvent);

    expect(component.manufacturerForm.get('displayOrder')?.value).toBe(50);
  });

  it('should clear displayOrder form control for input less than 1', () => {
    const inputEvent = {
      target: {
        value: '0'
      }
    } as unknown as Event;

    component.onDisplayOrderChange(inputEvent);

    expect(component.manufacturerForm.get('displayOrder')?.value).toBeNull();
    expect((inputEvent.target as HTMLInputElement).value).toBe('');
  });

  it('should clear displayOrder form control for empty input', () => {
    const inputEvent = {
      target: {
        value: ''
      }
    } as unknown as Event;

    component.onDisplayOrderChange(inputEvent);

    expect(component.manufacturerForm.get('displayOrder')?.value).toBeNull();
    expect((inputEvent.target as HTMLInputElement).value).toBe('');
  });

  it('should navigate to /manufacturer-list on onBack()', () => {
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['/manufacturer-list']);
  });


  it('should truncate input to max length and validate range', () => {
    const displayOrderControl = component.manufacturerForm.get('displayOrder');
    if (!displayOrderControl) {
      fail('DisplayOrder control is not available');
      return;
    }

    // Test case for input within valid range and length
    const inputEventValid = {
      target: { value: '50' }
    } as unknown as Event;
    component.onDisplayOrderChange(inputEventValid);
    expect(displayOrderControl.value).toBe(50);

    // Test case for input exceeding max length
    const inputEventExceedingLength = {
      target: { value: '123' }
    } as unknown as Event;
    component.onDisplayOrderChange(inputEventExceedingLength);
    expect(displayOrderControl.value).toBe(12); // Adjusted value for max length of 2

    // Test case for input out of valid range (less than 1)
    const inputEventBelowRange = {
      target: { value: '0' }
    } as unknown as Event;
    component.onDisplayOrderChange(inputEventBelowRange);

    // Test case for input out of valid range (greater than 100)
    const inputEventAboveRange = {
      target: { value: '101' }
    } as unknown as Event;
    component.onDisplayOrderChange(inputEventAboveRange);

    // Test case for non-numeric input
    const inputEventNonNumeric = {
      target: { value: 'abc' }
    } as unknown as Event;
    component.onDisplayOrderChange(inputEventNonNumeric);
  });


  it('should call create when form is valid and manufacturerId is not present', () => {
    component.manufacturerForm.patchValue({
      manufacturerId: 0,
      manufacturerName: 'New Manufacturer',
      description: 'New Description',
      discounts: '10.00',
      displayOrder: 1,
      limitedToVendors: [1],
      published: true
    });

    component.onSubmit();

    expect(mockService.create).toHaveBeenCalledWith(component.manufacturerForm.value);
    expect(router.navigate).toHaveBeenCalledWith(['/manufacturer']);
    expect(snackBar.open).toHaveBeenCalledWith('Manufacturer created successfully!', 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  });

  //it('should show an error message if form is invalid on submit', () => {
  //  component.manufacturerForm.patchValue({
  //    manufacturerName: '',
  //    description: '',
  //    discounts: '',
  //    displayOrder: '',
  //    limitedToVendors: [],
  //    published: false
  //  });

  //  component.onSubmit();

  //  expect(snackBar.open).toHaveBeenCalledWith('Please fix the errors in the form.', 'Close', {
  //    duration: 3000,
  //    verticalPosition: 'top',
  //    horizontalPosition: 'right',
  //  });
  //});

  it('should show a warning if 0 is entered in displayOrder', () => {
    const control = component.manufacturerForm.get('displayOrder');
    component.onDisplayOrderChange({ target: { value: '0' } } as unknown as Event);
    expect(control?.errors).toEqual({ invalidRange: true });
  });


});

