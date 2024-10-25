
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ManufacturerDetailsService } from '../../services/manufacturer-details.service';
import { VendorApproval } from '../../models/vendor-approval';
//import { capitalizedValidator, maxThreeDigitsValidator, positiveIntegerWithRangeAndLengthValidator } from './validators';
import { ManufacturerDTO } from '../../models/ManufacturerDTO';
import { MatSnackBar } from '@angular/material/snack-bar';


const DISCOUNT_REGEX = /^\d{1,2}(?:\.\d{0,2})?$/;

@Component({
  selector: 'app-manufacturer-details',
  templateUrl: './manufacturer-details.component.html',
  styleUrls: ['./manufacturer-details.component.css']
})
export class ManufacturerDetailsComponent implements OnInit {

  manufacturerForm!: FormGroup;
  vendors: VendorApproval[] = [];
  selectedManufacturer?: ManufacturerDTO;
  errorMessage: string | undefined;
  

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private manufacturerService: ManufacturerDetailsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadVendors();
  }

  initializeForm(): void {
    this.manufacturerForm = this.fb.group({
      manufacturerId: [0],
      manufacturerName: [null, [
        Validators.required,
        Validators.pattern(/^[A-Za-z ]*$/), // Only alphabets and spaces
        Validators.maxLength(30), // Length constraint
        this.capitalizeFirstLetterValidator
      ]],

      description: [null, [
        Validators.required,
        Validators.pattern(/^[A-Za-z ]*$/), // Only alphabets and spaces
        Validators.maxLength(300) // Maximum length constraint
      ]],

      //discounts: [0, [Validators.required, positiveIntegerValidator(), Validators.min(0), Validators.max(100)]],

      discounts: [null, [
        Validators.required,
        Validators.pattern(DISCOUNT_REGEX)
      ]],

      displayOrder: [null, [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
        Validators.pattern('^(?!0$)[1-9][0-9]?$|^100$') // Validate integer from 1 to 100
      ]],

      limitedToVendors: [[], Validators.required],
      published: [false],
      createdOn: [{ value: new Date().toISOString(), disabled: true }]  // Properly initialize as string
    });
  }



  // Custom validator to ensure the first letter is capitalized
  capitalizeFirstLetterValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;

    const isCapitalized = /^[A-Z]/.test(value);
    return isCapitalized ? null : { 'capitalized': true };
  }

  // Capitalize the first letter on blur event
  capitalizeFirstLetter(): void {
    const control = this.manufacturerForm.get('manufacturerName');
    if (control && control.value) {
      const capitalizedValue = control.value
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      control.setValue(capitalizedValue, { emitEvent: false });
    }
  }

  // Restrict input to alphabets and spaces only in real-time
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^A-Za-z ]/g, ''); // Remove non-alphabetic and non-space characters
    this.manufacturerForm.get('manufacturerName')?.setValue(input.value, { emitEvent: false });
  }



  onDiscountsChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove any non-matching characters
    if (!DISCOUNT_REGEX.test(value)) {
      // Remove characters that do not match the pattern
      value = value.replace(/[^0-9.]/g, '');

      // Ensure value does not exceed 2 digits before and after the decimal point
      // Remove trailing zeros after the decimal point if needed
      value = value.replace(/^(\d*?)\.(\d{0,2}).*$/, '$1.$2');  // Keep only up to 2 decimal places
      value = value.replace(/(\.\d*?)0+$/, '$1');  // Remove trailing zeros after decimal point
      value = value.replace(/^(\d{1,2})\d*$/, '$1');  // Ensure value does not exceed 2 digits before decimal point

      // Update the form control value
      input.value = value;
      this.manufacturerForm.get('discounts')?.setValue(value, { emitEvent: false });
    }
  }


  onDisplayOrderChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = Number(input.value);

    // Check if the input starts with '0'
    if (input.value.startsWith('0')) {
      // If the input starts with '0', clear the input and set the error state
      input.value = '';
      this.manufacturerForm.get('displayOrder')?.setErrors({ invalidRange: true });
      this.manufacturerForm.get('displayOrder')?.markAsTouched(); // Trigger validation feedback
      return; // Exit the function as the input is invalid
    }

    // Check if the value is within the valid range
    if (value < 1 || value > 100 || isNaN(value)) {
      // If the value is invalid, set the error state but do not clear the input
      this.manufacturerForm.get('displayOrder')?.setErrors({ invalidRange: true });
      this.manufacturerForm.get('displayOrder')?.markAsTouched(); // Trigger validation feedback
    } else {
      // If valid, update the form control value
      this.manufacturerForm.get('displayOrder')?.setValue(value, { emitEvent: false });
      this.manufacturerForm.get('displayOrder')?.setErrors(null); // Clear any previous errors
    }

    // Restrict input to only allow numbers with up to 2 digits
    const maxLength = 2;
    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength); // Truncate input if it exceeds max length
      value = Number(input.value); // Update the value with truncated input
      if (value < 1 || value > 100 || isNaN(value)) {
        this.manufacturerForm.get('displayOrder')?.setErrors({ invalidRange: true });
      } else {
        this.manufacturerForm.get('displayOrder')?.setValue(value, { emitEvent: false });
        this.manufacturerForm.get('displayOrder')?.setErrors(null); // Clear any previous errors
      }
    }
  }



 

  loadVendors(): void {
    this.manufacturerService.getVendors().subscribe(
      data => {
        this.vendors = data;
      },
      error => {
        console.error('Error loading vendors:', error);
      }
    );
  }

  selectManufacturer(manufacturer: ManufacturerDTO): void {
    this.selectedManufacturer = manufacturer;
    this.manufacturerForm.patchValue({
      ...manufacturer,
      createdOn: manufacturer.createdOn || new Date().toISOString()  // Ensure createdOn is set
    });
  }

  onSubmit(): void {
    this.manufacturerForm.markAllAsTouched(); // Ensure all controls are marked as touched

    if (this.manufacturerForm.valid) {
      const manufacturerDTO: ManufacturerDTO = this.manufacturerForm.value; /// .getRawValue() // best to use
      manufacturerDTO.createdOn = new Date().toISOString();

      if (manufacturerDTO.manufacturerId) {
        this.manufacturerService.update(manufacturerDTO.manufacturerId, manufacturerDTO).subscribe({
          next: () => {
            this.snackBar.open('Manufacturer updated successfully!', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
            });
            this.router.navigate(['/manufacturer']);
          },
          error: (error) => {
            console.error('Update error:', error);
            this.snackBar.open('Error updating manufacturer. Please try again.', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
            });
          }
        });
      } else {
        this.manufacturerService.create(manufacturerDTO).subscribe({
          next: () => {
            this.snackBar.open('Manufacturer created successfully!', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
            });
            this.router.navigate(['/manufacturer']);
          },
          error: (error) => {
            console.error('Creation error:', error);
            this.snackBar.open('Error creating manufacturer. Please try again.', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
            });
          }
        });
      }
    } else {
      this.snackBar.open('Please fill in the form.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
    }
  }


  onBack(): void {
    this.router.navigate(['/manufacturer-list']);
  }
}
