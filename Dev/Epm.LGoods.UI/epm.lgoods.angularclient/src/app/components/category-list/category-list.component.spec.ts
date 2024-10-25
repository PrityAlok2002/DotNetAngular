import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CategoryListComponent } from './category-list.component';
import { CategoryServiceService } from '../../services/category-service.service';
import { Category } from '../../models/category';

describe('CategoryListComponent', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let categoryService: jasmine.SpyObj<CategoryServiceService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const categoryServiceSpy = jasmine.createSpyObj('CategoryServiceService', ['getCategories']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [CategoryListComponent],
      providers: [
        { provide: CategoryServiceService, useValue: categoryServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryServiceService) as jasmine.SpyObj<CategoryServiceService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Set up default spy behavior
    categoryService.getCategories.and.returnValue(of({ $values: [] }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize categories on ngOnInit', () => {
    const mockCategories: Category[] = [
      { categoryId: 1, categoryName: 'Category 1', description: 'Desc 1', image: 'image1.jpg', isActive: true }
    ];
    categoryService.getCategories.and.returnValue(of({ $values: mockCategories }));

    component.ngOnInit();

    expect(component.categories).toEqual(mockCategories);
    expect(component.filteredCategories).toEqual(mockCategories);
  });

  it('should toggle filter visibility', () => {
    expect(component.showFilter).toBeFalse();
    component.toggleFilter();
    expect(component.showFilter).toBeTrue();
    component.toggleFilter();
    expect(component.showFilter).toBeFalse();
  });

  it('should apply filter on input change', () => {
    spyOn(component, 'applyFilter');
    component.filter.categoryName = 'Test';
    component.onInputChange();
    expect(component.applyFilter).toHaveBeenCalled();
  });

  it('should clear active filter', () => {
    component.filter.isActive = 'active';
    component.clearActiveFilter();
    expect(component.filter.isActive).toBe('');
    expect(component.filteredCategories).toEqual(component.categories);
  });

  it('should filter categories correctly', () => {
    const mockCategories: Category[] = [
      { categoryId: 1, categoryName: 'Category 1', description: 'Desc 1', image: 'image1.jpg', isActive: true },
      { categoryId: 2, categoryName: 'Category 2', description: 'Desc 2', image: 'image2.jpg', isActive: false },
    ];
    component.categories = mockCategories;
    component.filter.categoryName = '1';
    component.filter.isActive = '';

    component.filterCategories();

    expect(component.filteredCategories).toEqual([mockCategories[0]]);
  });

  it('should handle categoryService errors gracefully', () => {
    categoryService.getCategories.and.returnValue(throwError(() => new Error('Service Error')));

    component.getCategories();

    expect(component.categories).toEqual([]);
  });

  it('should sort categories by key', () => {
    const mockCategories: Category[] = [
      { categoryId: 2, categoryName: 'B', description: 'Desc B', image: 'imageB.jpg', isActive: true },
      { categoryId: 1, categoryName: 'A', description: 'Desc A', image: 'imageA.jpg', isActive: false },
    ];
    component.filteredCategories = mockCategories;

    // Sort by categoryName
    component.sortCategories('categoryName');
    expect(component.filteredCategories[0].categoryName).toBe('A');

    // Change direction and sort again
    component.sortCategories('categoryName');
    expect(component.filteredCategories[0].categoryName).toBe('B');
  });

  it('should navigate to category creation', () => {
    component.navigateToCategoryCreation();
    expect(router.navigate).toHaveBeenCalledWith(['/category-creation']);
  });

  it('should navigate to category update', () => {
    component.navigateToCategoryUpdate(1);
    expect(router.navigate).toHaveBeenCalledWith(['/category-update', 1]);
  });
});
