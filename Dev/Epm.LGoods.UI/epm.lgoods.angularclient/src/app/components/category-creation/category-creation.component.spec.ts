import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CategoryCreationComponent } from './category-creation.component';
import { CategoryServiceService } from '../../services/category-service.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpErrorResponse } from '@angular/common/http';

class MockCategoryService {
  getCategoryById(id: number) {
    return of({
      categoryName: 'Test Category',
      description: 'Test Description',
      isActive: true,
      image: 'test-image-url'
    });
  }

  validateCategoryName(name: string) {
    return of(false);
  }

  updateCategory(id: number, formData: FormData) {
    return of({});
  }

  createCategory(formData: FormData) {
    return of({});
  }
}

describe('CategoryCreationComponent', () => {
  let component: CategoryCreationComponent;
  let fixture: ComponentFixture<CategoryCreationComponent>;
  let mockCategoryService: MockCategoryService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    mockCategoryService = new MockCategoryService();

    await TestBed.configureTestingModule({
      declarations: [CategoryCreationComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        BrowserAnimationsModule // Include this
      ],
      providers: [
        { provide: CategoryServiceService, useValue: mockCategoryService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}) 
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryCreationComponent);
    component = fixture.componentInstance;
    mockCategoryService = TestBed.inject(CategoryServiceService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values for create', () => {
    component.categoryId = null;
    component.isEdit = false; // Ensure it is in create mode
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.categoryForm.value).toEqual({
      CategoryName: '',
      Description: '',
      Image: null,
      Status: true
    });
  });


  it('should validate category name on blur', () => {
    spyOn(mockCategoryService, 'validateCategoryName').and.returnValue(of(true));
    component.categoryForm.get('CategoryName')?.setValue('Existing Category');
    component.onBlurValidateCategoryName();
    expect(component.categoryForm.get('CategoryName')?.errors?.['invalidCategoryName']).toBeTruthy();
  });


  it('should set categoryId and call loadCategory if id param exists', () => {
    route.params = of({id:1});
    spyOn(component, 'loadCategory').and.callThrough();

    // Trigger ngOnInit
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.categoryId).toBe(1);
    expect(component.isEdit).toBeTrue();
    expect(component.loadCategory).toHaveBeenCalled();
  });


  it('should submit form and update category', () => {
    component.isEdit = true;
    component.categoryId = 1;
    component.categoryForm.patchValue({
      CategoryName: 'Updated Category',
      Description: 'Updated Description',
      Status: true
    });
    component.categoryForm.markAsDirty(); 

    spyOn(mockCategoryService, 'updateCategory').and.returnValue(of({}));
    spyOn(component, 'handleSuccess');

    component.submit();

    expect(mockCategoryService.updateCategory).toHaveBeenCalled();
    expect(component.handleSuccess).toHaveBeenCalledWith('Category updated successfully');
  });

  it('should handle error on updateCategory', () => {
    const error = new HttpErrorResponse({ status: 500 });
    const updateCategorySpy = spyOn(mockCategoryService, 'updateCategory').and.returnValue(throwError(error));
    component.submit();
    expect(component.errorMessage).toBe('');
  });

  it('should handle success response', () => {
    spyOn(component, 'handleSuccess').and.callThrough();
    component.handleSuccess('Category updated successfully');
    expect(component.errorMessage).toBe('');
    expect(router.navigate).toHaveBeenCalledWith(['/category-list']);
  });


  it('should navigate back to category list', () => {
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['/category-list']);
  });




  it('should handle file size exceeds limit', () => {
    const event = { target: { files: [{ size: 3 * 1024 * 1024, type: 'image/png', name: 'test.png' }] } };

    spyOn(window, 'alert');

    component.onFileChange(event as any);

    expect(window.alert).toHaveBeenCalledWith("File size must be less than 2MB");
    expect(component.images).toEqual([]);
    expect(component.categoryForm.get('Image')?.value).toBeNull();
  });

  it('should handle invalid file type', () => {
    const event = { target: { files: [{ size: 1 * 1024 * 1024, type: 'pdf', name: 'test.pdf' }] } };

    spyOn(window, 'alert');

    component.onFileChange(event as any);

    expect(window.alert).toHaveBeenCalledWith("Only images are allowed (PNG, JPEG)");
    expect(component.images).toEqual([]);
    expect(component.categoryForm.get('Image')?.value).toBeNull();
  });

  it('should handle error on createCategory', () => {
    const error = new HttpErrorResponse({ status: 500 });
    const createCategorySpy = spyOn(mockCategoryService, 'createCategory').and.returnValue(throwError(error));
    component.submit();
    expect(component.errorMessage).toBe('');
  });

});
