import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryServiceService } from '../../services/category-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category-creation',
  templateUrl: './category-creation.component.html',
  styleUrls: ['./category-creation.component.css']
})
export class CategoryCreationComponent implements OnInit {
  categoryForm: FormGroup;
  errorMessage: string = '';
  images: string[] = [];
  categoryId: number | null = null;
  isEdit: boolean = false;
  initialFormValues: any;


  @ViewChild('imageInput') imageInput: any;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryServiceService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      CategoryName: ['', [Validators.required, Validators.maxLength(50)]],
      Description: ['', [Validators.maxLength(500)]],
      Image: [null],
      Status: [true]
    }, { validators: this.imageRequiredValidator() });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.categoryId = +params['id'];
        this.isEdit = true;
        this.loadCategory();
      }
    });
    this.initialFormValues = this.categoryForm.value;
    this.categoryForm.valueChanges.subscribe(() => {
      this.checkFormChanges();
    });
  }
  

  loadCategory(): void {
    if (this.categoryId) {
      this.categoryService.getCategoryById(this.categoryId).subscribe(
        category => {
          this.categoryForm.patchValue({
            CategoryName: category.categoryName,
            Description: category.description,
            Status: category.isActive
          });
          this.images = [category.image]; // Assuming image is a URL
        },
        (error: HttpErrorResponse) => {
          console.error('Error loading category', error);
        }
      );
    }
  }

  onBlurValidateCategoryName() {
    let categoryName = this.categoryForm.get('CategoryName')?.value.trim();
    if (!categoryName) {
      this.categoryForm.get('CategoryName')?.setErrors({ 'required': true });
      return;
    } else {
      this.categoryService.validateCategoryName(categoryName).subscribe(
        isValid => {
          if (isValid) {
            this.categoryForm.get('CategoryName')?.setErrors({ 'invalidCategoryName': true });
          }
        },
        (error: HttpErrorResponse) => {
          console.error('Error validating category name', error);
        }
      );
    }
  }

  onStatusChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.categoryForm.get('Status')?.setValue(input.checked);
  }


  onFileChange(event: any) {
  const file = event.target.files[0];
  
  if (!file) {
    return;
  }

  const fileSizeInMB = file.size / (1024 * 1024);
  if (fileSizeInMB > 2) {
    alert("File size must be less than 2MB");
    event.target.value = null;
    return;
  }

  const allowedTypes = ['image/png', 'image/jpeg'];
  if (!allowedTypes.includes(file.type)) {
    alert("Only images are allowed (PNG, JPEG)");
    event.target.value = null;
    return;
  }

  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.images = [e.target.result]; // Replace any existing images
  };
  reader.readAsDataURL(file);

  this.categoryForm.patchValue({
    Image: file
  });
    this.categoryForm.markAsDirty();
  }


  private imageRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const image = control.get('Image')?.value;
      const isEdit = this.isEdit;
      if (!image && !isEdit) {
        return { 'imageRequired': true };
      }
      return null;
    };
  }


  public prepareFormData(): FormData {
    const formData = new FormData();
    formData.append('CategoryName', this.categoryForm.get('CategoryName')?.value.trim());
    formData.append('Description', this.getDescriptionValue());
    const imageFile = this.categoryForm.get('Image')?.value;
    if (imageFile instanceof File) {
      formData.append('Image', imageFile, imageFile.name);
    }
    formData.append('Status', this.categoryForm.get('Status')?.value);
    return formData;
  }

  private getDescriptionValue(): string {
    const description = this.categoryForm.get('Description')?.value;
    return description && description.trim() !== '' ? description : '';
  }

  public handleSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 6000,
      panelClass: ['success-snackbar']
    });
    this.router.navigate(['/category-list']);
  }

  public handleError(error: HttpErrorResponse, action: string): void {
    console.error(`Error ${action} category`, error);
    this.snackBar.open(`Error ${action} category`, 'Close', {
      duration: 6000,
      panelClass: ['error-snackbar']
    });
    this.errorMessage = 'Unknown error occurred. Please try again later.';
  }

  submit(): void {
    if (this.categoryForm.invalid || !this.categoryForm.dirty) {
      this.snackBar.open('Unable to perform the operation', 'Close', {
        duration: 6000,
        panelClass: ['success-snackbar']
      });
      return;
    }
    const formData = this.prepareFormData();

    if (this.isEdit && this.categoryId) {
      this.updateCategory(formData);
    } else {
      this.createCategory(formData);
    }
  }

  public updateCategory(formData: FormData): void {
    if (this.categoryId) {
      this.categoryService.updateCategory(this.categoryId, formData).subscribe(
        response => this.handleSuccess('Category updated successfully'),
        error => this.handleError(error, 'updating')
      );
    }
  }

  public createCategory(formData: FormData): void {
    this.categoryService.createCategory(formData).subscribe(
      response => {
        this.snackBar.open('Category created successfully', 'Close', {
          duration: 6000,
          panelClass: ['success-snackbar']
        });
        this.categoryForm.reset();
        this.imageInput.nativeElement.value = '';
      },
      error => this.handleError(error, 'creating')
    );
  }

  private hasFormChanged(): boolean {
    return JSON.stringify(this.categoryForm.value) !== JSON.stringify(this.initialFormValues);
  }

  private checkFormChanges(): void {
    const hasChanges = this.hasFormChanged();
    const submitButton = document.getElementById('submitButton') as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = !hasChanges;
    }
  }

  onBack(): void {
    this.router.navigate(['/category-list']);
  }
}
