import { AbstractControl, ValidatorFn, FormGroup, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { RegistrationService } from '../services/register.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const email = control.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(email);
    return !isValid ? { invalidEmail: true } : null;
  };
}

export function passwordMatcher(): ValidatorFn {
  return (group: AbstractControl): { [key: string]: boolean } | null => {
    const formGroup = group as FormGroup;  
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}

export function emailExistsValidator(registrationService: RegistrationService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return registrationService.checkEmailExists(control.value).pipe(
      map(isExists => (isExists ? { emailExists: true } : null)),
      catchError(() => of(null))
    );
  };
}
