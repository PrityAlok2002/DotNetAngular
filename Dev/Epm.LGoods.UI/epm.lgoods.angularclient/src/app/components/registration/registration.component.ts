import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../../services/register.service';
import { emailValidator, emailExistsValidator } from '../../services/validator';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  errorMessage: string = '';
  registrationSuccessful: boolean = false;
  registrationError: string | null = null;
  thankYouMessageVisible: boolean = false;
  emailExistsError: boolean = false;


  constructor(
    public fb: FormBuilder,
    public registrationService: RegistrationService
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern('^[a-zA-Z]+$')]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern('^[a-zA-Z]+$')]],
      email: ['', [Validators.required, emailValidator()], [emailExistsValidator(this.registrationService)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ]],
      confirmPassword: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[6789]\d{9}$/)]],
      accountType: ['', Validators.required],
      businessName: [''],
      city: [''],
      state: [''],
      zipcode: ['']
    }, { validators: this.passwordMatchValidator });

    this.onAccountTypeChange();
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'confirmPassword') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onAccountTypeChange(): void {
    this.registrationForm.get('accountType')?.valueChanges.subscribe(accountType => {
      if (accountType === 'Vendor') {
        this.registrationForm.get('businessName')?.setValidators([Validators.required, Validators.maxLength(50)]);
        this.registrationForm.get('city')?.setValidators([Validators.required, Validators.maxLength(20)]);
        this.registrationForm.get('state')?.setValidators([Validators.required, Validators.maxLength(20)]);
        this.registrationForm.get('zipcode')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{6}$/)]);
      } else {
        this.registrationForm.get('businessName')?.clearValidators();
        this.registrationForm.get('city')?.clearValidators();
        this.registrationForm.get('state')?.clearValidators();
        this.registrationForm.get('zipcode')?.clearValidators();
      }
      this.registrationForm.get('businessName')?.updateValueAndValidity();
      this.registrationForm.get('city')?.updateValueAndValidity();
      this.registrationForm.get('state')?.updateValueAndValidity();
      this.registrationForm.get('zipcode')?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.registrationForm.invalid || this.registrationForm.hasError('passwordMismatch')) {
      this.errorMessage = this.registrationForm.hasError('passwordMismatch')
        ? 'Password and Confirm Password do not match.'
        : 'Please correct the errors in the form.';
      return;
    }

    const formValues = this.registrationForm.value;

    const registrationDto = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      mobileNumber: formValues.mobileNumber,
      accountType: formValues.accountType,
      businessName: formValues.accountType === 'Vendor' ? formValues.businessName : undefined,
      city: formValues.accountType === 'Vendor' ? formValues.city : undefined,
      state: formValues.accountType === 'Vendor' ? formValues.state : undefined,
      zipCode: formValues.accountType === 'Vendor' ? formValues.zipcode : undefined
    };

    this.registrationService.register(registrationDto).subscribe(
      () => {
        console.log('Registration successful.');
        this.registrationSuccessful = true;
        this.registrationError = null;
        this.thankYouMessageVisible = true;
        this.registrationForm.reset();
        setTimeout(() => {
          this.registrationSuccessful = false;
          this.thankYouMessageVisible = false;
        }, 10000);
      },
      (error) => {
        if (error.message === 'Email already exists') {
          this.emailExistsError = true;
          this.registrationForm.get('email')?.setErrors({ emailExists: true });
        } else {
          console.log(registrationDto);
          console.error('Error registering user:', error);
          this.registrationError = 'Error registering user.';
        }
      }
    );
  }

  isVendor(): boolean {
    return this.registrationForm.get('accountType')?.value === 'Vendor';
  }

  preventNonLetters(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.keyCode);
    if (!/[a-zA-Z]/.test(inputChar)) {
      event.preventDefault();
    }
  }

  get passwordMismatch() {
    return this.registrationForm.hasError('passwordMismatch');
  }
}
