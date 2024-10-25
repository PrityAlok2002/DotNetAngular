import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { InventoryComponent } from './inventory.component';
import { InventoryService } from '../../services/inventory.service';

// Mock classes
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: jasmine.createSpy('get').and.returnValue('123')
    }
  };
  queryParamMap = of({ get: jasmine.createSpy('get').and.returnValue('456') });
}

class MockMatSnackBar {
  open = jasmine.createSpy('open');
}

describe('InventoryComponent', () => {
  let component: InventoryComponent;
  let fixture: ComponentFixture<InventoryComponent>;
  let mockSnackBar: MockMatSnackBar;
  let formBuilder: FormBuilder;
  let mockRouter: MockRouter;
  let inventoryService: jasmine.SpyObj<InventoryService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [InventoryComponent],
      providers: [
        { provide: FormBuilder, useClass: FormBuilder },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
        { provide: InventoryService, useValue: inventoryService },
        InventoryService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryComponent);
    component = fixture.componentInstance;
    mockSnackBar = TestBed.inject(MatSnackBar) as any;
    formBuilder = TestBed.inject(FormBuilder);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with productId from query params', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.inventoryForm.get('productId')?.value).toBe(456);
  });

  it('should initialize form with default values for other fields', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.inventoryForm.get('minimumCartQuantity')?.value).toBe('');
    expect(component.inventoryForm.get('maximumCartQuantity')?.value).toBe('');
    expect(component.inventoryForm.get('quantityStep')?.value).toBe('');
  });

  it('should require productId in the form', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const productIdControl = component.inventoryForm.get('productId');
    expect(productIdControl?.valid).toBeTrue();
    expect(productIdControl?.hasError('required')).toBeFalse();
  });

  it('should validate minimumCartQuantity with correct pattern', () => {
    const control = component.inventoryForm.get('minimumCartQuantity');
    control?.setValue('123');
    expect(control?.valid).toBeTrue();
    control?.setValue('0');
    expect(control?.invalid).toBeTrue();
    control?.setValue('1001');
    expect(control?.invalid).toBeTrue();
  });

  it('should validate maximumCartQuantity with correct pattern', () => {
    const control = component.inventoryForm.get('maximumCartQuantity');
    control?.setValue('500');
    expect(control?.valid).toBeTrue();
    control?.setValue('0');
    expect(control?.invalid).toBeTrue();
    control?.setValue('1001');
    expect(control?.invalid).toBeTrue();
  });

  it('should validate quantityStep with correct pattern', () => {
    const control = component.inventoryForm.get('quantityStep');
    control?.setValue('5');
    expect(control?.valid).toBeTrue();
    control?.setValue('0');
    expect(control?.invalid).toBeTrue();
    control?.setValue('15');
    expect(control?.invalid).toBeTrue();
  });

  it('should set errors for invalid minimumCartQuantity', () => {
    component.inventoryForm = formBuilder.group({
      minimumCartQuantity: [''],
      maximumCartQuantity: ['']
    });

    const input = { value: '1001', selectionStart: 0, setSelectionRange: jasmine.createSpy('setSelectionRange') } as unknown as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onMinimumCartQuantityChange(event);

    expect(component.inventoryForm.get('minimumCartQuantity')?.hasError('invalidRange')).toBeTrue();
    expect(component.inventoryForm.get('minimumCartQuantity')?.value).toBe('');
    expect(component.inventoryForm.get('minimumCartQuantity')?.touched).toBeTrue();
    expect(input.setSelectionRange).toHaveBeenCalledWith(0, 0);
  });

  it('should set errors for minimumCartQuantity less than 1', () => {
    component.inventoryForm = formBuilder.group({
      minimumCartQuantity: [''],
      maximumCartQuantity: ['']
    });

    const input = { value: '0', selectionStart: 0, setSelectionRange: jasmine.createSpy('setSelectionRange') } as unknown as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onMinimumCartQuantityChange(event);

    expect(component.inventoryForm.get('minimumCartQuantity')?.hasError('invalidRange')).toBeTrue();
    expect(component.inventoryForm.get('minimumCartQuantity')?.value).toBe('');
    expect(component.inventoryForm.get('minimumCartQuantity')?.touched).toBeTrue();
    expect(input.setSelectionRange).toHaveBeenCalledWith(0, 0);
  });

  it('should set errors for non-numeric minimumCartQuantity', () => {
    component.inventoryForm = formBuilder.group({
      minimumCartQuantity: [''],
      maximumCartQuantity: ['']
    });

    const input = { value: 'abc', selectionStart: 0, setSelectionRange: jasmine.createSpy('setSelectionRange') } as unknown as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onMinimumCartQuantityChange(event);

    expect(component.inventoryForm.get('minimumCartQuantity')?.hasError('invalidRange')).toBeTrue();
    expect(component.inventoryForm.get('minimumCartQuantity')?.value).toBe('');
    expect(component.inventoryForm.get('minimumCartQuantity')?.touched).toBeTrue();
    expect(input.setSelectionRange).toHaveBeenCalledWith(0, 0);
  });

  it('should not set errors for valid minimumCartQuantity and validate maximumCartQuantity', () => {
    component.inventoryForm = formBuilder.group({
      minimumCartQuantity: [10],
      maximumCartQuantity: [20]
    });

    const input = { value: '15', selectionStart: 5, setSelectionRange: jasmine.createSpy('setSelectionRange') } as unknown as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onMinimumCartQuantityChange(event);

    expect(component.inventoryForm.get('minimumCartQuantity')?.hasError('invalidRange')).toBeFalse();
    expect(component.inventoryForm.get('minimumCartQuantity')?.value).toBe(15);
    expect(component.inventoryForm.get('maximumCartQuantity')?.hasError('minInvalid')).toBeFalse();
    expect(input.setSelectionRange).toHaveBeenCalledWith(5, 5);
  });

  it('should set errors for maximumCartQuantity if new minimumCartQuantity is not less', () => {
    component.inventoryForm = formBuilder.group({
      minimumCartQuantity: [15],
      maximumCartQuantity: [10]
    });

    const input = { value: '20', selectionStart: 0, setSelectionRange: jasmine.createSpy('setSelectionRange') } as unknown as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onMinimumCartQuantityChange(event);

    expect(component.inventoryForm.get('minimumCartQuantity')?.hasError('invalidRange')).toBeFalse();
    expect(component.inventoryForm.get('maximumCartQuantity')?.hasError('minInvalid')).toBeTrue();
    expect(input.setSelectionRange).toHaveBeenCalledWith(0, 0);
  });

  it('should restore cursor position after updating input value', () => {
    component.inventoryForm = formBuilder.group({
      minimumCartQuantity: ['']
    });

    const input = { value: '123', selectionStart: 5, setSelectionRange: jasmine.createSpy('setSelectionRange') } as unknown as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onMinimumCartQuantityChange(event);

    expect(input.setSelectionRange).toHaveBeenCalledWith(5, 5);
  });

  it('should set errors for maximumCartQuantity less than 1', () => {
    component.inventoryForm = formBuilder.group({
      minimumCartQuantity: [10],
      maximumCartQuantity: ['']
    });

    const input = { value: '0', selectionStart: 0, setSelectionRange: jasmine.createSpy('setSelectionRange') } as unknown as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onMaximumCartQuantityChange(event);

    expect(component.inventoryForm.get('maximumCartQuantity')?.hasError('invalidRange')).toBeTrue();
    expect(component.inventoryForm.get('maximumCartQuantity')?.value).toBe('');
    expect(component.inventoryForm.get('maximumCartQuantity')?.touched).toBeTrue();
    expect(input.setSelectionRange).toHaveBeenCalledWith(0, 0);
  });

  it('should set errors for maximumCartQuantity greater than 1000', () => {
    component.inventoryForm = formBuilder.group({
      minimumCartQuantity: [10],
      maximumCartQuantity: ['']
    });

    const input = { value: '1001', selectionStart: 0, setSelectionRange: jasmine.createSpy('setSelectionRange') } as unknown as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onMaximumCartQuantityChange(event);

    expect(component.inventoryForm.get('maximumCartQuantity')?.hasError('invalidRange')).toBeTrue();
    expect(component.inventoryForm.get('maximumCartQuantity')?.value).toBe('');
    expect(component.inventoryForm.get('maximumCartQuantity')?.touched).toBeTrue();
    expect(input.setSelectionRange).toHaveBeenCalledWith(0, 0);
  });

  it('should set errors for non-numeric maximumCartQuantity', () => {
    component.inventoryForm = formBuilder.group({
      minimumCartQuantity: [10],
      maximumCartQuantity: ['']
    });

    const input = { value: 'abc', selectionStart: 0, setSelectionRange: jasmine.createSpy('setSelectionRange') } as unknown as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onMaximumCartQuantityChange(event);

    expect(component.inventoryForm.get('maximumCartQuantity')?.hasError('invalidRange')).toBeTrue();
    expect(component.inventoryForm.get('maximumCartQuantity')?.value).toBe('');
    expect(component.inventoryForm.get('maximumCartQuantity')?.touched).toBeTrue();
    expect(input.setSelectionRange).toHaveBeenCalledWith(0, 0);
  });

  it('should set errors for maximumCartQuantity not greater than minimumCartQuantity', () => {
    component.inventoryForm = formBuilder.group({
      minimumCartQuantity: [15],
      maximumCartQuantity: [10]
    });

    const input = { value: '14', selectionStart: 0, setSelectionRange: jasmine.createSpy('setSelectionRange') } as unknown as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onMaximumCartQuantityChange(event);

    expect(component.inventoryForm.get('maximumCartQuantity')?.hasError('maxInvalid')).toBeTrue();
    expect(component.inventoryForm.get('maximumCartQuantity')?.value).toBe(14);
    expect(component.inventoryForm.get('maximumCartQuantity')?.touched).toBeTrue();
    expect(input.setSelectionRange).toHaveBeenCalledWith(0, 0);
  });

  it('should not set errors for valid maximumCartQuantity and validate minimumCartQuantity', () => {
    component.inventoryForm = formBuilder.group({
      minimumCartQuantity: [10],
      maximumCartQuantity: [20]
    });

    const input = { value: '15', selectionStart: 5, setSelectionRange: jasmine.createSpy('setSelectionRange') } as unknown as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onMaximumCartQuantityChange(event);

    expect(component.inventoryForm.get('maximumCartQuantity')?.hasError('invalidRange')).toBeFalse();
    expect(component.inventoryForm.get('maximumCartQuantity')?.hasError('maxInvalid')).toBeFalse();
    expect(component.inventoryForm.get('maximumCartQuantity')?.value).toBe(15);
    expect(input.setSelectionRange).toHaveBeenCalledWith(5, 5);
  });

  it('should restore cursor position after updating input value', () => {
    component.inventoryForm = formBuilder.group({
      maximumCartQuantity: ['']
    });

    const input = { value: '123', selectionStart: 5, setSelectionRange: jasmine.createSpy('setSelectionRange') } as unknown as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onMaximumCartQuantityChange(event);

    expect(input.setSelectionRange).toHaveBeenCalledWith(5, 5);
  });

  ////////////////////


  it('should set errors for quantityStep less than 1', () => {
    component.inventoryForm = formBuilder.group({
      quantityStep: ['']
    });

    const input = { value: '0', selectionStart: 0, setSelectionRange: jasmine.createSpy('setSelectionRange') } as unknown as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onQuantityStepChange(event);

    expect(component.inventoryForm.get('quantityStep')?.hasError('invalidRange')).toBeTrue();
    expect(component.inventoryForm.get('quantityStep')?.value).toBe('');
    expect(component.inventoryForm.get('quantityStep')?.touched).toBeTrue();
    expect(input.setSelectionRange).toHaveBeenCalledWith(0, 0);
  });

  it('should set errors for quantityStep greater than 10', () => {
    component.inventoryForm = formBuilder.group({
      quantityStep: ['']
    });

    const input = { value: '11', selectionStart: 0, setSelectionRange: jasmine.createSpy('setSelectionRange') } as unknown as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onQuantityStepChange(event);

    expect(component.inventoryForm.get('quantityStep')?.hasError('invalidRange')).toBeTrue();
    expect(component.inventoryForm.get('quantityStep')?.value).toBe('');
    expect(component.inventoryForm.get('quantityStep')?.touched).toBeTrue();
    expect(input.setSelectionRange).toHaveBeenCalledWith(0, 0);
  });

  it('should set errors for non-numeric quantityStep', () => {
    component.inventoryForm = formBuilder.group({
      quantityStep: ['']
    });

    const input = { value: 'abc', selectionStart: 0, setSelectionRange: jasmine.createSpy('setSelectionRange') } as unknown as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onQuantityStepChange(event);

    expect(component.inventoryForm.get('quantityStep')?.hasError('invalidRange')).toBeTrue();
    expect(component.inventoryForm.get('quantityStep')?.value).toBe('');
    expect(component.inventoryForm.get('quantityStep')?.touched).toBeTrue();
    expect(input.setSelectionRange).toHaveBeenCalledWith(0, 0);
  });

  it('should not set errors for valid quantityStep', () => {
    component.inventoryForm = formBuilder.group({
      quantityStep: ['']
    });

    const input = { value: '5', selectionStart: 5, setSelectionRange: jasmine.createSpy('setSelectionRange') } as unknown as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onQuantityStepChange(event);

    expect(component.inventoryForm.get('quantityStep')?.hasError('invalidRange')).toBeFalse();
    expect(component.inventoryForm.get('quantityStep')?.value).toBe(5);
    expect(input.setSelectionRange).toHaveBeenCalledWith(5, 5);
  });

  it('should restore cursor position after updating input value', () => {
    component.inventoryForm = formBuilder.group({
      quantityStep: ['']
    });

    const input = { value: '123', selectionStart: 5, setSelectionRange: jasmine.createSpy('setSelectionRange') } as unknown as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onQuantityStepChange(event);

    expect(input.setSelectionRange).toHaveBeenCalledWith(5, 5);
  });

  it('should call loadInventory and perform its logic', () => {
    spyOn(component, 'loadInventory').and.callThrough();

    // Trigger loadInventory
    component.loadInventory();

    expect(component.loadInventory).toHaveBeenCalled();
    // Additional expectations can be added based on the implementation of loadInventory
  });

  ///////////

  it('should initialize form with productId from query params', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.inventoryForm.get('productId')?.value).toBe(456);
  });

  it('should initialize form with default values for other fields', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.inventoryForm.get('minimumCartQuantity')?.value).toBe('');
    expect(component.inventoryForm.get('maximumCartQuantity')?.value).toBe('');
    expect(component.inventoryForm.get('quantityStep')?.value).toBe('');
  });

  it('should require productId in the form', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const productIdControl = component.inventoryForm.get('productId');
    expect(productIdControl?.valid).toBeTrue();
    expect(productIdControl?.hasError('required')).toBeFalse();
  });

  it('should validate minimumCartQuantity with correct pattern', () => {
    const control = component.inventoryForm.get('minimumCartQuantity');
    control?.setValue(123);
    expect(control?.valid).toBeTrue();
    control?.setValue(0);
    expect(control?.invalid).toBeTrue();
    control?.setValue(1001);
    expect(control?.invalid).toBeTrue();
  });

  it('should validate maximumCartQuantity with correct pattern', () => {
    const control = component.inventoryForm.get('maximumCartQuantity');
    control?.setValue(500);
    expect(control?.valid).toBeTrue();
    control?.setValue(0);
    expect(control?.invalid).toBeTrue();
    control?.setValue(1001);
    expect(control?.invalid).toBeTrue();
  });

  it('should validate quantityStep with correct pattern', () => {
    const control = component.inventoryForm.get('quantityStep');
    control?.setValue(5);
    expect(control?.valid).toBeTrue();
    control?.setValue(0);
    expect(control?.invalid).toBeTrue();
    control?.setValue(15);
    expect(control?.invalid).toBeTrue();
  });

  
});
