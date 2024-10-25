import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { ProductCreationComponent } from './product-creation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductService } from '../../services/product.service';

describe('ProductCreationComponent', () => {
  let component: ProductCreationComponent;
  let fixture: ComponentFixture<ProductCreationComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['updateProduct', 'createProduct']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ProductCreationComponent],
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCreationComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    fixture.detectChanges();
  });

  it('should initialize the form with default values', () => {
    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('countryOfOrigin')?.value).toBe('');
  });

  it('should initialize countries array correctly', () => {
    const expectedCountries = [
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

    expect(component.countries.length).toBe(expectedCountries.length);
    expectedCountries.forEach((country, index) => {
      expect(component.countries[index]).toBe(country);
    });
  });

  it('should not submit the form if the form is invalid', () => {
    component.productForm.reset();
    component.onSubmit();
    expect(productService.createProduct).not.toHaveBeenCalled();
    expect(snackBar.open).not.toHaveBeenCalled();
  });

  it('should mark form controls as touched when the form is invalid', () => {
    component.productForm.reset();
    component.onSubmit();
    Object.keys(component.productForm.controls).forEach(key => {
      expect(component.productForm.get(key)?.touched).toBeTrue();
    });
  });

  it('should mark form as touched and not call createProduct if required fields are missing', () => {
    component.productForm = new FormGroup({
      productName: new FormControl('', Validators.required),
      description: new FormControl(''),
      productType: new FormControl('', Validators.required),
      shortDescription: new FormControl(''),
      mfgDate: new FormControl('')
    });

    component.onSubmit();

    expect(component.productForm.controls['productName'].touched).toBeTrue();
    expect(component.productForm.controls['productType'].touched).toBeTrue();

    expect(productService.createProduct).not.toHaveBeenCalled();

    expect(snackBar.open).not.toHaveBeenCalled();
  });


  it('should call createProduct if the form has default values and no changes', () => {
    component.productForm = new FormGroup({
      productName: new FormControl('Default Product Name'),
      description: new FormControl('Default Description'),
      productType: new FormControl('Default Type'),
      shortDescription: new FormControl('Default Short Description'),
      mfgDate: new FormControl(new Date())
    });

    productService.createProduct.and.returnValue(of({}));

    component.onSubmit();

    expect(productService.createProduct).toHaveBeenCalled();

    expect(snackBar.open).toHaveBeenCalledWith('Product successfully submitted', 'Close', { duration: 3000 });
  });




  it('should have a valid form when all required fields are filled', () => {
    component.productForm.setValue({
      productName: 'Test Product',
      productType: 'Test Type',
      shortDescription: 'Test Description',
      mfgDate: '',
      expiryDate: '',
      countryOfOrigin: 'United States',
      stockQuantity: 10,
      weight: 1,
      length: 1,
      width: 1,
      height: 1
    });
    expect(component.productForm.valid).toBeTrue();
  });

  it('should have an invalid form when required fields are missing', () => {
    component.productForm.setValue({
      productName: '',
      productType: '',
      shortDescription: '',
      mfgDate: '',
      expiryDate: '',
      countryOfOrigin: '',
      stockQuantity: null,
      weight: null,
      length: null,
      width: null,
      height: null
    });
    expect(component.productForm.invalid).toBeTrue();
  });

  it('should not call productService.createProduct when form is invalid and submitted', () => {
    component.productForm.setValue({
      productName: '',
      productType: 'Test Type',
      shortDescription: 'Test Description',
      mfgDate: '',
      expiryDate: '',
      countryOfOrigin: '',
      stockQuantity: 10,
      weight: 1,
      length: 1,
      width: 1,
      height: 1
    });
    component.onSubmit();
    expect(productService.createProduct).not.toHaveBeenCalled();
  });

  it('should call productService.createProduct when form is valid and submit is triggered', () => {
    component.productForm.setValue({
      productName: 'Valid Product',
      productType: 'Valid Type',
      shortDescription: 'Valid Description',
      mfgDate: '2024-08-01',
      expiryDate: '2024-08-02',
      countryOfOrigin: 'United States',
      stockQuantity: 10,
      weight: 1,
      length: 1,
      width: 1,
      height: 1
    });
    productService.createProduct.and.returnValue(of({}));
    component.onSubmit();
    expect(productService.createProduct).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith('Product successfully submitted', 'Close', { duration: 3000 });
  });

  it('should handle productService.createProduct error', () => {
    component.productForm.setValue({
      productName: 'Error Product',
      productType: 'Error Type',
      shortDescription: 'Error Description',
      mfgDate: '2024-08-01',
      expiryDate: '2024-08-02',
      countryOfOrigin: 'United States',
      stockQuantity: 10,
      weight: 1,
      length: 1,
      width: 1,
      height: 1
    });
    productService.createProduct.and.returnValue(throwError(() => new Error('Error')));
    component.onSubmit();
    expect(productService.createProduct).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith('Error submitting product', 'Close', { duration: 3000 });
  });



  it('should call updateProduct on form submission when productId is present', () => {
    const productData = {
      productId: 1,
      productName: 'Test Product',
      productType: 'Test Type',
      shortDescription: 'Test Description',
      mfgDate: new Date(),
      expiryDate: new Date(),
      countryOfOrigin: 'United States',
      stockQuantity: 10,
      weight: 1,
      length: 1,
      width: 1,
      height: 1
    };

    // Include productId in the form group
    component.productForm = new FormGroup({
      productId: new FormControl(productData.productId),
      productName: new FormControl(productData.productName, Validators.required),
      productType: new FormControl(productData.productType, Validators.required),
      shortDescription: new FormControl(productData.shortDescription, Validators.required),
      mfgDate: new FormControl(productData.mfgDate, Validators.required),
      expiryDate: new FormControl(productData.expiryDate, Validators.required),
      countryOfOrigin: new FormControl(productData.countryOfOrigin, Validators.required),
      stockQuantity: new FormControl(productData.stockQuantity, Validators.required),
      weight: new FormControl(productData.weight, Validators.required),
      length: new FormControl(productData.length, Validators.required),
      width: new FormControl(productData.width, Validators.required),
      height: new FormControl(productData.height, Validators.required)
    });

    component.productId = productData.productId;
    component.isEditMode = true;

    productService.updateProduct.and.returnValue(of({}));

    component.onSubmit();

    expect(productService.updateProduct).toHaveBeenCalledWith(productData.productId, jasmine.any(FormData));
    expect(snackBar.open).toHaveBeenCalledWith('Product successfully updated', 'Close', { duration: 3000 });
  });

  it('should handle productService.updateProduct error', () => {
    const productId = 123;

    // Mock the updateProduct method to return an error
    productService.updateProduct.and.returnValue(throwError(() => new Error('Update failed')));

    // Set component to edit mode with a product ID
    component.isEditMode = true;
    component.productId = productId;

    // Set form as valid
    component.productForm = new FormGroup({

      productName: new FormControl('Valid Product', Validators.required),
      productType: new FormControl('Type', Validators.required),
      shortDescription: new FormControl('Short description', Validators.required),
      mfgDate: new FormControl(new Date('2024-01-01'), Validators.required),
      expiryDate: new FormControl(new Date('2025-01-01'), Validators.required),
      countryOfOrigin: new FormControl('Country', Validators.required),
      stockQuantity: new FormControl(100, Validators.required),
      weight: new FormControl(1.5, Validators.required),
      length: new FormControl(10, Validators.required),
      width: new FormControl(5, Validators.required),
      height: new FormControl(5, Validators.required),
    });

    // Trigger form submission
    component.onSubmit();

    // Ensure updateProduct was called with the correct arguments
    expect(productService.updateProduct).toHaveBeenCalledWith(productId, jasmine.any(FormData));

    // Ensure the snackbar is called with error message
    expect(snackBar.open).toHaveBeenCalledWith('Error updating product', 'Close', { duration: 3000 });
  });

  it('should have a valid form when all required fields are filled', () => {
    component.productForm.setValue({
      productName: 'Test Product',
      productType: 'Test Type',
      shortDescription: 'Test Description',
      mfgDate: '',
      expiryDate: '',
      countryOfOrigin: 'United States',
      stockQuantity: 10,
      weight: 1,
      length: 1,
      width: 1,
      height: 1
    });
    expect(component.productForm.valid).toBeTrue();
  });

  it('should disable submit button when form is invalid', () => {
    component.productForm.setValue({
      productName: '',
      productType: '',
      shortDescription: 'Test Description',
      mfgDate: '',
      expiryDate: '',
      countryOfOrigin: 'United States',
      stockQuantity: 10,
      weight: 1,
      length: 1,
      width: 1,
      height: 1
    });
    expect(component.productForm.invalid).toBeTrue();
  });






  describe('restrictSpecialCharactersForDesc', () => {
    let component: ProductCreationComponent;
    let fixture: ComponentFixture<ProductCreationComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(ProductCreationComponent);
      component = fixture.componentInstance;
    });

    it('should remove special characters from input value', () => {
      const inputElement = document.createElement('input');
      inputElement.value = 'Hello@World!123';

      const event = { target: inputElement } as unknown as Event;

      component.restrictSpecialCharactersForDesc(event);

      expect(inputElement.value).toBe('HelloWorld123');
    });

    it('should truncate input value if it exceeds 300 characters', () => {
      const longValue = 'A'.repeat(305);
      const inputElement = document.createElement('input');
      inputElement.value = longValue;

      const event = { target: inputElement } as unknown as Event;

      component.restrictSpecialCharactersForDesc(event);

      expect(inputElement.value.length).toBe(300);
      expect(inputElement.value).toBe('A'.repeat(300));
    });

    it('should keep input value unchanged if it is valid and within 300 characters', () => {
      const validValue = 'Valid123Value';
      const inputElement = document.createElement('input');
      inputElement.value = validValue;

      const event = { target: inputElement } as unknown as Event;

      component.restrictSpecialCharactersForDesc(event);

      expect(inputElement.value).toBe(validValue);
    });

    it('should handle an empty input value', () => {
      const inputElement = document.createElement('input');
      inputElement.value = '';

      const event = { target: inputElement } as unknown as Event;

      component.restrictSpecialCharactersForDesc(event);

      expect(inputElement.value).toBe('');
    });

    it('should handle input value with exactly 300 characters with valid characters', () => {
      const validValue = 'A'.repeat(300);
      const inputElement = document.createElement('input');
      inputElement.value = validValue;

      const event = { target: inputElement } as unknown as Event;

      component.restrictSpecialCharactersForDesc(event);

      expect(inputElement.value).toBe(validValue);
    });
  });


  describe('restrictNumericInput', () => {
    let component: ProductCreationComponent;
    let fixture: ComponentFixture<ProductCreationComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(ProductCreationComponent);
      component = fixture.componentInstance;
    });

    it('should remove non-numeric characters if decimals are not allowed', () => {
      const inputElement = document.createElement('input');
      inputElement.value = '123abc456!@#';

      const event = { target: inputElement } as unknown as Event;

      component.restrictNumericInput(event, 10, false);

      expect(inputElement.value).toBe('123456');
    });

    it('should remove non-numeric characters and keep decimal if allowed', () => {
      const inputElement = document.createElement('input');
      inputElement.value = '12a.34b56c';

      const event = { target: inputElement } as unknown as Event;

      component.restrictNumericInput(event, 10, true);

      expect(inputElement.value).toBe('12.3456');
    });

    it('should truncate input value if it exceeds maxLength', () => {
      const inputElement = document.createElement('input');
      inputElement.value = '12345678901';

      const event = { target: inputElement } as unknown as Event;

      component.restrictNumericInput(event, 10, false);

      expect(inputElement.value).toBe('1234567890');
    });

    it('should handle input with decimal points correctly when decimals are allowed', () => {
      const inputElement = document.createElement('input');
      inputElement.value = '12.34.56';

      const event = { target: inputElement } as unknown as Event;

      component.restrictNumericInput(event, 10, true);

      expect(inputElement.value).toBe('12.3456');
    });

    it('should not add leading zero if input starts with a decimal point', () => {
      const inputElement = document.createElement('input');
      inputElement.value = '.1234';

      const event = { target: inputElement } as unknown as Event;

      component.restrictNumericInput(event, 10, true);

      expect(inputElement.value).toBe('0.1234');
    });

    it('should not alter valid numeric input when decimals are not allowed', () => {
      const inputElement = document.createElement('input');
      inputElement.value = '123456';

      const event = { target: inputElement } as unknown as Event;

      component.restrictNumericInput(event, 10, false);

      expect(inputElement.value).toBe('123456');
    });

    it('should handle empty input value correctly', () => {
      const inputElement = document.createElement('input');
      inputElement.value = '';

      const event = { target: inputElement } as unknown as Event;

      component.restrictNumericInput(event, 10, true);

      expect(inputElement.value).toBe('');
    });

    it('should handle input with maximum length and decimal correctly', () => {
      const inputElement = document.createElement('input');
      inputElement.value = '1234567890.12';

      const event = { target: inputElement } as unknown as Event;

      component.restrictNumericInput(event, 10, true);

      expect(inputElement.value).toBe('1234567890');
    });
  });





  describe('restrictSpecialCharacters', () => {
    let component: ProductCreationComponent
    let fixture: ComponentFixture<ProductCreationComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(ProductCreationComponent);
      component = fixture.componentInstance;
    });

    it('should remove special characters from input value', () => {
      const inputElement = document.createElement('input');
      inputElement.value = 'Hello@World!#2024';

      const event = { target: inputElement } as unknown as Event;

      component.restrictSpecialCharacters(event);

      expect(inputElement.value).toBe('HelloWorld2024');
    });

    it('should not alter valid alphanumeric input and spaces', () => {
      const inputElement = document.createElement('input');
      inputElement.value = 'Valid Input 123';

      const event = { target: inputElement } as unknown as Event;

      component.restrictSpecialCharacters(event);

      expect(inputElement.value).toBe('Valid Input 123');
    });

    it('should handle input value exactly 50 characters long', () => {
      const inputElement = document.createElement('input');
      inputElement.value = '12345678901234567890123456789012345678901234567890';

      const event = { target: inputElement } as unknown as Event;

      component.restrictSpecialCharacters(event);

      expect(inputElement.value).toBe('12345678901234567890123456789012345678901234567890');
    });



    it('should handle empty input value', () => {
      const inputElement = document.createElement('input');
      inputElement.value = '';

      const event = { target: inputElement } as unknown as Event;

      component.restrictSpecialCharacters(event);

      expect(inputElement.value).toBe('');
    });

    it('should handle input with only special characters', () => {
      const inputElement = document.createElement('input');
      inputElement.value = '@#$%^&*()_+';

      const event = { target: inputElement } as unknown as Event;

      component.restrictSpecialCharacters(event);

      expect(inputElement.value).toBe('');
    });

  });
});
