import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';

import { Product } from '../../models/product';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-product-creation',
  templateUrl: './product-creation.component.html',
  styleUrls: ['./product-creation.component.css']
})
export class ProductCreationComponent implements OnInit {
  productForm: FormGroup;
  isEditMode: boolean = false; // Add this to check if we are in edit mode
  productId?: number; // Add this to hold the ID of the product being edited
  product?: Product; // Add this line to declare the product property
  countries: string[] = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola',
    'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados',
    'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei',
    'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
    'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile',
    'China', 'Colombia', 'Comoros', 'Congo', 'Congo, Democratic Republic of the',
    'Costa Rica', 'Côte d\'Ivoire', 'Croatia', 'Cuba', 'Curaçao',
    'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica',
    'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
    'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji',
    'Finland', 'France', 'Gabon', 'Gambia', 'Georgia',
    'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala',
    'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras',
    'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran',
    'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica',
    'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati',
    'Korea, North', 'Korea, South', 'Kuwait', 'Kyrgyzstan', 'Laos',
    'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya',
    'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi',
    'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands',
    'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova',
    'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique',
    'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands',
    'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue',
    'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan',
    'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru',
    'Philippines', 'Pitcairn Islands', 'Poland', 'Portugal', 'Puerto Rico',
    'Qatar', 'Réunion', 'Romania', 'Russia', 'Rwanda',
    'Samoa', 'San Marino', 'São Tomé and Príncipe', 'Saudi Arabia', 'Senegal',
    'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia',
    'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan',
    'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden',
    'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania',
    'Thailand', 'Timor-Leste', 'Togo', 'Tokelau', 'Tonga',
    'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
    'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
    'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela',
    'Vietnam', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'
  ];



  constructor(private fb: FormBuilder, private productService: ProductService, public snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute) {

    this.productForm = this.fb.group({
      productName: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9 ]*$') // Allow only letters, numbers, and spaces
      ]],
      productType: ['', [
        Validators.required,
        Validators.maxLength(50),
      ]],
      shortDescription: ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.pattern('^[a-zA-Z0-9.,!? ]*$') // Allow letters, numbers, and specific punctuation
      ]],
      mfgDate: [''],
      expiryDate: [''],
      countryOfOrigin: ['', Validators.required],
      stockQuantity: ['', [
        Validators.min(0),
        Validators.pattern('^[0-9]*$') // Only numbers
      ]],
      weight: ['', [
        Validators.min(0),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*\\.?[0-9]+$') // Numbers with optional decimal
      ]],
      length: ['', [
        Validators.min(0),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*\\.?[0-9]+$') // Numbers with optional decimal
      ]],
      width: ['', [
        Validators.min(0),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*\\.?[0-9]+$') // Numbers with optional decimal
      ]],
      height: ['', [
        Validators.min(0),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*\\.?[0-9]+$') // Numbers with optional decimal
      ]]
    }, { validators: this.dateValidator });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      if (this.productId) {
        this.isEditMode = true;
        this.productService.fetchProductById(this.productId).subscribe(product => {
          this.product = product;
          console.log(this.product);

          const formattedMfgDate = this.formatDate(new Date(product.mfgDate));
          const formattedExpiryDate = this.formatDate(new Date(product.expiryDate));

          this.productForm.patchValue({
            ...product,
            mfgDate: formattedMfgDate,
            expiryDate: formattedExpiryDate
          });
        },
        error => {
            this.snackBar.open('Error fetching product', 'Close', { duration: 3000 });
          }
        );
      }
    });
    }


  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  dateValidator(formGroup: FormGroup) {
    const mfgDate = formGroup.get('mfgDate')?.value;
    const expiryDate = formGroup.get('expiryDate')?.value;

    if (mfgDate && expiryDate && new Date(expiryDate) < new Date(mfgDate)) {
      return { expiryBeforeMfg: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('productId', this.productId?.toString() || '0'); // Add product ID to form data'
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        if (control) {
          console.log(key, control.value);
          formData.append(key, control.value);
        }
      });


      if (this.isEditMode && this.productId) { // Check if in edit mode

        this.productService.updateProduct(this.productId, formData).subscribe({
          next: () => {
            this.snackBar.open('Product successfully updated', 'Close', {
              duration: 3000,
            });
            this.productForm.reset();
            this.isEditMode = false; // Reset edit mode flag
            this.productId = undefined; // Reset product ID
          },
          error: (err) => {
            console.error('Error updating product', err);
            this.snackBar.open('Error updating product', 'Close', {
              duration: 3000,
            });
          }
        });
      } else {
        
       
        this.productService.createProduct(formData).subscribe({
          next: (response) => {
            const productId = response.productId;
            this.snackBar.open('Product successfully submitted', 'Close', {
              duration: 3000,
            });
            this.productForm.reset();
            this.router.navigate(['/product-layout/price'], { queryParams: { id: productId } });
          },
          error: (err) => {
            
            console.error('Error creating product', err);
            this.snackBar.open('Error submitting product', 'Close', {
              duration: 3000,
            });
          }
        });
      }

    }
    this.productForm.markAllAsTouched();
  }


 



  

  restrictSpecialCharacters(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    const pattern = /^[a-zA-Z0-9 ]*$/; 

    if (!pattern.test(value)) {
      value = value.replace(/[^a-zA-Z0-9 ]/g, '');
    }

    if (value.length > 50) {
      value = value.slice(0, 50); 
    }

    input.value = value;
  }


  restrictSpecialCharactersForDesc(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    const pattern = /^[a-zA-Z0-9 ]*$/; 

    if (!pattern.test(value)) {
      value = value.replace(/[^a-zA-Z0-9 ]/g, '');
    }

    if (value.length > 300) {
      value = value.slice(0, 300); 
    }

    input.value = value;
  }

  restrictNumericInput(event: Event, maxLength: number = 10, allowDecimal: boolean = false): void {
  const input = event.target as HTMLInputElement;
  let value = input.value;

  const decimalPattern = /^[0-9]*([.,][0-9]*)?$/;
  const integerPattern = /^[0-9]*$/;
  const pattern = allowDecimal ? decimalPattern : integerPattern;

  if (!pattern.test(value)) {
    value = value.replace(/[^0-9.]/g, ''); 
  }

  if (allowDecimal) {
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    if (value.startsWith('.')) {
      value = '0' + value;
    }
  }

  if (value.length > maxLength) {
    value = value.slice(0, maxLength);
  }

  input.value = value;
}


}
