import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { PriceService } from '../../services/price.service';
import { Price } from '../../models/price.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent implements OnInit {
  priceForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private priceService: PriceService) {
    this.priceForm = this.fb.group({
      currency: ['', [Validators.required, Validators.maxLength(3), this.uppercaseAlphabetOnlyValidator]],
      discountPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]{1,3}$')]],
      effectivePrice: [{ value: 0, disabled: true }, Validators.required],
      priceAmount: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.max(99999999.99), // Adjust based on your requirements
          Validators.pattern('^[0-9]{1,8}(?:\.[0-9]{1,2})?$')
        ]
      ],
      productId: ['', [Validators.required, Validators.pattern('^[0-9]{1,10}$')]],
      vendorId: ['', [Validators.required, Validators.pattern('^[0-9]{1,10}$')]]
    });
  }

  ngOnInit(): void {
    this.priceForm.get('priceAmount')?.valueChanges.subscribe(priceAmount => {
      this.calculateEffectivePrice();
    });
    this.priceForm.get('discountPercentage')?.valueChanges.subscribe(discountPercentage => {
      this.calculateEffectivePrice();
    });
  }

  // Custom validator for uppercase alphabetical letters only
  uppercaseAlphabetOnlyValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value as string;
    if (value && !/^[A-Z]+$/.test(value)) {
      return { invalidCurrency: true };
    }
    return null;
  }

  limitDiscountPercentage(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;


    value = value.replace(/\D/g, '');
    const numericValue = Math.min(parseInt(value, 10) || 0, 100);
    this.priceForm.get('discountPercentage')?.setValue(numericValue, { emitEvent: false });
    if (value.length === 0 || isNaN(numericValue)) {
      this.priceForm.get('discountPercentage')?.setValue(0, { emitEvent: false });
    }
  }

  limitProductId(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/\D/g, ''); // Remove non-numeric characters
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    this.priceForm.get('productId')?.setValue(value, { emitEvent: false });
  }

  limitVendorId(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/\D/g, ''); // Remove non-numeric characters
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    this.priceForm.get('vendorId')?.setValue(value, { emitEvent: false });
  }


  limitPriceAmount(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove any characters that are not digits or decimal points
    value = value.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point is allowed
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

    // Ensure the decimal point is not leading
    if (value.startsWith('.')) {
      value = '0' + value; // Add leading zero if decimal point is at the start
    }

    // Ensure the value conforms to the regex and limit the total length to 10 characters
    const regex = /^\d{0,6}(?:\.\d{0,2})?$/;
    if (!regex.test(value)) {
      // If the value does not match, remove the last character
      value = value.slice(0, -1);
    }

    // Limit to 10 characters including decimal point
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    // Set the value back to the form control
    this.priceForm.get('priceAmount')?.setValue(value, { emitEvent: false });
  }



  limitCurrency(): void {
    const control = this.priceForm.get('currency');
    if (control) {
      let value = control.value?.toString().toUpperCase() || '';
      value = value.replace(/[^A-Z]/g, '');
      control.setValue(value, { emitEvent: false });
    }
  }

  calculateEffectivePrice(): void {
    const priceAmount = this.priceForm.get('priceAmount')?.value;
    let discountPercentage = this.priceForm.get('discountPercentage')?.value;

    if (priceAmount !== null && discountPercentage !== null) {

      discountPercentage = Math.max(0, Math.min(discountPercentage, 100));


      const effectivePrice = priceAmount - (priceAmount * (discountPercentage / 100));


      const formattedEffectivePrice = parseFloat(Math.max(0, effectivePrice).toFixed(2));


      this.priceForm.get('effectivePrice')?.setValue(formattedEffectivePrice, { emitEvent: false });
    }
  }


  onSubmit(): void {
    if (this.priceForm.valid) {
      const price: Price = this.priceForm.value;
      this.priceService.createPrice(price).subscribe((result: Price) => {
        console.log('Price created', result);
        this.successMessage = 'Price successfully added';
        this.errorMessage = null;
        this.priceForm.reset();
        this.priceForm.get('effectivePrice')?.setValue(0);
        setTimeout(() => {
          this.successMessage = null;
        }, 5000);
      },
        (error: HttpErrorResponse) => {
          console.error('Error creating price', error);
          this.errorMessage = error.message || 'Failed to create price. Please try again.';
          this.successMessage = null;
        }
      );
    }
  }
}
