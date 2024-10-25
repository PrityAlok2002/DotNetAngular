import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RegistrationComponent } from './registration.component';
import { RegistrationService } from '../../services/register.service';
import { of, throwError } from 'rxjs';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let mockRegistrationService: jasmine.SpyObj<RegistrationService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('RegistrationService', ['register', 'checkEmailExists']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RegistrationComponent],
      providers: [{ provide: RegistrationService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    mockRegistrationService = TestBed.inject(RegistrationService) as jasmine.SpyObj<RegistrationService>;

    mockRegistrationService.checkEmailExists.and.returnValue(of(false)); // Assume email does not exist
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const form = component.registrationForm;
    expect(form).toBeTruthy();
    expect(form.get('firstName')?.value).toBe('');
    expect(form.get('lastName')?.value).toBe('');
    expect(form.get('email')?.value).toBe('');
    expect(form.get('password')?.value).toBe('');
    expect(form.get('confirmPassword')?.value).toBe('');
    expect(form.get('mobileNumber')?.value).toBe('');
    expect(form.get('accountType')?.value).toBe('');
    expect(form.get('businessName')?.value).toBe('');
    expect(form.get('city')?.value).toBe('');
    expect(form.get('state')?.value).toBe('');
    expect(form.get('zipcode')?.value).toBe('');
  });

  it('should toggle password visibility', () => {
    component.togglePasswordVisibility('password');
    expect(component.passwordVisible).toBeTrue();

    component.togglePasswordVisibility('password');
    expect(component.passwordVisible).toBeFalse();
  });

  it('should set businessName field as required for Vendor account type', () => {
    component.registrationForm.get('accountType')?.setValue('Vendor');
    component.registrationForm.get('businessName')?.setValue('');
    component.registrationForm.get('businessName')?.updateValueAndValidity();

    expect(component.registrationForm.get('businessName')?.hasError('required')).toBeTrue();
  });

  it('should prevent non-letter input for certain fields', () => {
    const event = new KeyboardEvent('keydown', { key: '1', keyCode: 49 });
    const preventDefaultSpy = spyOn(event, 'preventDefault');

    component.preventNonLetters(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should initialize with passwordVisible and confirmPasswordVisible set to false', () => {
    expect(component.passwordVisible).toBeFalse();
    expect(component.confirmPasswordVisible).toBeFalse();
  });

  it('should toggle confirmPassword visibility', () => {
    component.togglePasswordVisibility('confirmPassword');
    expect(component.confirmPasswordVisible).toBeTrue();

    component.togglePasswordVisibility('confirmPassword');
    expect(component.confirmPasswordVisible).toBeFalse();
  });

  it('should enable vendor fields when account type is Vendor', () => {
    component.registrationForm.get('accountType')?.setValue('Vendor');
    component.onAccountTypeChange();

    expect(component.registrationForm.get('businessName')?.valid).toBeFalse();
    expect(component.registrationForm.get('city')?.valid).toBeFalse();
    expect(component.registrationForm.get('state')?.valid).toBeFalse();
    expect(component.registrationForm.get('zipcode')?.valid).toBeFalse();
  });

  it('should disable vendor fields when account type is not Vendor', () => {
    component.registrationForm.get('accountType')?.setValue('User');
    component.onAccountTypeChange();

    expect(component.registrationForm.get('businessName')?.valid).toBeTrue();
    expect(component.registrationForm.get('city')?.valid).toBeTrue();
    expect(component.registrationForm.get('state')?.valid).toBeTrue();
    expect(component.registrationForm.get('zipcode')?.valid).toBeTrue();
  });

  it('should initialize errorMessage, registrationSuccessful, registrationError, and thankYouMessageVisible appropriately', () => {
    expect(component.errorMessage).toBe('');
    expect(component.registrationSuccessful).toBeFalse();
    expect(component.registrationError).toBeNull();
    expect(component.thankYouMessageVisible).toBeFalse();
  });

  it('should detect Vendor account type correctly', () => {
    component.registrationForm.get('accountType')?.setValue('Vendor');
    expect(component.isVendor()).toBeTrue();

    component.registrationForm.get('accountType')?.setValue('Customer');
    expect(component.isVendor()).toBeFalse();
  });

  it('should require firstName and lastName fields', () => {
    component.registrationForm.get('firstName')?.setValue('');
    component.registrationForm.get('lastName')?.setValue('');
    component.registrationForm.get('firstName')?.markAsTouched();
    component.registrationForm.get('lastName')?.markAsTouched();

    expect(component.registrationForm.get('firstName')?.hasError('required')).toBeTrue();
    expect(component.registrationForm.get('lastName')?.hasError('required')).toBeTrue();
  });

  it('should require valid password format', () => {
    component.registrationForm.get('password')?.setValue('weak');
    component.registrationForm.get('password')?.markAsTouched();

    expect(component.registrationForm.get('password')?.hasError('pattern')).toBeTrue();
  });

  it('should not submit the form if invalid', () => {
    component.registrationForm.get('firstName')?.setValue('');
    component.registrationForm.get('email')?.setValue('invalid-email');
    component.onSubmit();
    expect(component.errorMessage).toBe('Please correct the errors in the form.');
  });

  it('should display error message if form is invalid', () => {
    component.registrationForm.get('firstName')?.setValue('');
    component.registrationForm.get('email')?.setValue('invalid-email');

    component.onSubmit();

    expect(component.errorMessage).toBe('Please correct the errors in the form.');
    expect(mockRegistrationService.register).not.toHaveBeenCalled();
  });

  it('should display error message if passwords do not match', () => {
    component.registrationForm.get('password')?.setValue('Password123');
    component.registrationForm.get('confirmPassword')?.setValue('DifferentPassword123');

    component.onSubmit();

    expect(component.errorMessage).toBe('Password and Confirm Password do not match.');
    expect(mockRegistrationService.register).not.toHaveBeenCalled();
  });

  it('should set error message if form is invalid', () => {
    component.registrationForm.setValue({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobileNumber: '',
      accountType: 'Vendor',
      businessName: '',
      city: '',
      state: '',
      zipcode: ''
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Please correct the errors in the form.');
  });


  it('should handle registration error for existing email', () => {
    // Arrange
    const errorResponse = { message: 'Email already exists' };
    mockRegistrationService.register.and.returnValue(throwError(() => errorResponse));


    component.registrationForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
      mobileNumber: '9876543210',
      accountType: 'Vendor',
      businessName: 'Business',
      city: 'City',
      state: 'State',
      zipcode: '123456'
    });

    // Act
    component.onSubmit();

    // Assert
    expect(component.emailExistsError).toBeTrue();
    expect(component.registrationForm.get('email')?.hasError('emailExists')).toBeTrue();
  });



  it('should handle general registration error', () => {
    const errorResponse = { message: 'Some other error' };
    mockRegistrationService.register.and.returnValue(throwError(() => errorResponse));
    mockRegistrationService.checkEmailExists.and.returnValue(of(false)); // Simulate email does not exist

    component.registrationForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
      mobileNumber: '9876543210',
      accountType: 'Vendor',
      businessName: 'Business',
      city: 'City',
      state: 'State',
      zipcode: '123456'
    });

    component.onSubmit();

    expect(component.registrationError).toBe('Error registering user.');
    expect(component.emailExistsError).toBeFalse();
  });

  it('should return true for passwordMismatch if passwords do not match', () => {
    // Arrange
    component.registrationForm.get('password')?.setValue('Password123');
    component.registrationForm.get('confirmPassword')?.setValue('DifferentPassword123');
    component.registrationForm.updateValueAndValidity(); // Trigger validation

    // Act
    const result = component.passwordMismatch;

    // Assert
    expect(result).toBeTrue();
  });

  it('should return false for passwordMismatch if passwords match', () => {
    // Arrange
    component.registrationForm.get('password')?.setValue('Password123');
    component.registrationForm.get('confirmPassword')?.setValue('Password123');
    component.registrationForm.updateValueAndValidity(); // Trigger validation

    // Act
    const result = component.passwordMismatch;

    // Assert
    expect(result).toBeFalse();
  });

});
