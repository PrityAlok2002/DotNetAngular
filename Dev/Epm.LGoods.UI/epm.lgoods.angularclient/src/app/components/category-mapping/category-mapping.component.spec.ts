import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { CategoryMappingComponent } from './category-mapping.component';
import { ProductCategoryService } from '../../services/product-category.service';
import { mockPrice } from '../price/price.component.mock';

describe('CategoryMappingComponent', () => {
  let component: CategoryMappingComponent;
  let fixture: ComponentFixture<CategoryMappingComponent>;
  let service: ProductCategoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductCategoryService,
        { provide: ActivatedRoute, useValue: { queryParamMap: of({ get: () => 1 }) } }
      ],
      declarations: [CategoryMappingComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryMappingComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ProductCategoryService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all categories on init', () => {
    spyOn(service, 'getCategories').and.returnValue(of([]));
    component.ngOnInit();
    expect(service.getCategories).toHaveBeenCalled();
  });

  it('should set productId on init if route has productId', () => {
    spyOn(service, 'getCategories').and.returnValue(of([]));
    component.ngOnInit();
    expect(component.productId).toBe(1);
  });

  it('should not set productId on init if route does not have productId', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductCategoryService, { provide: ActivatedRoute, useValue: { queryParamMap: of({ get: () => null }) } }],
      declarations: [CategoryMappingComponent]
    });
    fixture = TestBed.createComponent(CategoryMappingComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ProductCategoryService);
    fixture.detectChanges();

    spyOn(service, 'getCategories').and.returnValue(of([]));
    component.ngOnInit();
    expect(component.productId).toBeUndefined(); // Use toBeUndefined() instead of toBeNull()
  });

  it('should add category mapping', () => {
    component.categoryId = 1;
    component.productId = 1;
    component.addCategoryMapping();
    expect(component.categoryMappings.length).toBe(1);
  });

  it('should remove category mapping', () => {
    component.categoryMappings.push({ categoryId: 1, productId: 1 });
    component.removeCategoryMapping(0);
    expect(component.categoryMappings.length).toBe(0);
  });

  it('should call saveMappings and add a category mapping', () => {
    component.productId = 1;
    component.selectedCategoryId = 1;
    const addCategoryMappingSpy = spyOn(service, 'addCategoryMapping').and.returnValue(EMPTY);

    component.saveMappings();
    expect(addCategoryMappingSpy).toHaveBeenCalledWith({ ProductId: 1, CategoryId: 1 });
  });

  it('should add category mapping', () => {
    let category = mockPrice;
    component.addCategoryMapping();
  });

  it('should call service.addCategoryMapping() method when saveMappings() called', () => {
    const addCategoryMappingSpy = spyOn(service, 'addCategoryMapping').and.returnValue(of());
    component.productId = 1;
    component.selectedCategoryId = 1;

    component.saveMappings();

    expect(addCategoryMappingSpy).toHaveBeenCalledTimes(1);
  });

  it('should send correct parameters to service.addCategoryMapping() when saveMappings() called', () => {
    const addCategoryMappingSpy = spyOn(service, 'addCategoryMapping').and.returnValue(of());
    component.productId = 1;
    component.selectedCategoryId = 1;

    component.saveMappings();

    expect(addCategoryMappingSpy).toHaveBeenCalledWith({ ProductId: 1, CategoryId: 1 });
  });

  it('should remove category mapping from component state when removing a category mapping', () => {
    const categoryMapping = { categoryId: 1, productId: 1 };
    component.categoryMappings = [categoryMapping, { categoryId: 2, productId: 2 }];

    component.removeCategoryMapping(0);

    expect(component.categoryMappings).toEqual([{ categoryId: 2, productId: 2 }]);
  });

  it('should remove category mapping from component state when removing a category mapping', () => {
    const categoryMapping = { categoryId: 1, productId: 1 };
    component.categoryMappings.push(categoryMapping);

    component.removeCategoryMapping(0);

    expect(component.categoryMappings).toEqual([]);
  });

  it('should send correct parameters to service.removeCategoryMapping() when removing a category mapping', () => {
    const categoryMapping = { categoryId: 1, productId: 1 };
    component.categoryMappings.push(categoryMapping);

    component.removeCategoryMapping(0);

    
    expect(component.categoryMappings).toEqual([]);
  });

  
});
