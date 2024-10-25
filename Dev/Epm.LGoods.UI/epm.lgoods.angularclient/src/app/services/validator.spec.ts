import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RegistrationService } from '../services/register.service';
import { emailValidator, passwordMatcher, emailExistsValidator } from './validator';
import { fakeAsync, tick } from '@angular/core/testing';

describe('Custom Validators', () => {
  let registrationService: jasmine.SpyObj<RegistrationService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('RegistrationService', ['checkEmailExists']);

    TestBed.configureTestingModule({
      providers: [
        { provide: RegistrationService, useValue: spy }
      ]
    });

    registrationService = TestBed.inject(RegistrationService) as jasmine.SpyObj<RegistrationService>;
  });

  describe('emailValidator', () => {
    it('should return null for valid email', () => {
      const control = new FormControl('test@example.com', emailValidator());
      expect(control.errors).toBeNull();
    });

    it('should return error object for invalid email', () => {
      const control = new FormControl('invalid-email', emailValidator());
      expect(control.errors).toEqual({ invalidEmail: true });
    });
  });

  describe('passwordMatcher', () => {
    it('should return null if passwords match', () => {
      const formGroup = new FormGroup({
        password: new FormControl('Password123!'),
        confirmPassword: new FormControl('Password123!')
      }, passwordMatcher());
      expect(formGroup.errors).toBeNull();
    });

    it('should return error object if passwords do not match', () => {
      const formGroup = new FormGroup({
        password: new FormControl('Password123!'),
        confirmPassword: new FormControl('DifferentPassword123!')
      }, passwordMatcher());
      expect(formGroup.errors).toEqual({ passwordMismatch: true });
    });
  });

  describe('emailExistsValidator', () => {
    it('should return null if email does not exist', fakeAsync(() => {
      registrationService.checkEmailExists.and.returnValue(of(false));
      const control = new FormControl('new.email@example.com', null, emailExistsValidator(registrationService));

      control.updateValueAndValidity();
      tick();
      expect(control.errors).toBeNull();
    }));

    it('should return error object if email exists', fakeAsync(() => {
      registrationService.checkEmailExists.and.returnValue(of(true));
      const control = new FormControl('existing.email@example.com', null, emailExistsValidator(registrationService));

      control.updateValueAndValidity();
      tick();
      expect(control.errors).toEqual({ emailExists: true });
    }));

    it('should return null if there is an error during email check', fakeAsync(() => {
      registrationService.checkEmailExists.and.returnValue(throwError(() => new Error('Error occurred')));
      const control = new FormControl('error.email@example.com', null, emailExistsValidator(registrationService));

      control.updateValueAndValidity();
      tick();
      expect(control.errors).toBeNull();
    }));
  });
});
