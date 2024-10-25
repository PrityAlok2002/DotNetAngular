import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Product } from '../../models/product';
import { ProductFilter } from '../../models/product-filter';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockProductService {
  fetchAllProducts() { return of([] as Product[]); }
  fetchProducts(filters: ProductFilter) { return of([] as Product[]); }
  deleteProduct(productId: number) { return of(null); }
}

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: ProductService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component and load products', () => {
    spyOn(component, 'loadProducts').and.callThrough();
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.loadProducts).toHaveBeenCalled();
  });

  it('should load products without filters', () => {
    spyOn(productService, 'fetchAllProducts').and.callThrough();
    component.filters = { productName: '', productType: '', countryOfOrigin: '' };
    component.loadProducts();
    expect(productService.fetchAllProducts).toHaveBeenCalled();
    expect(component.products).toEqual([]);
  });

  it('should handle error when loading products without filters', () => {
    spyOn(productService, 'fetchAllProducts').and.returnValue(throwError('Error'));
    component.filters = { productName: '', productType: '', countryOfOrigin: '' };
    component.loadProducts();
    expect(productService.fetchAllProducts).toHaveBeenCalled();
    expect(component.products).toEqual([]);
  });

  it('should load products with filters', () => {
    component.filters = { productName: 'Test', productType: '', countryOfOrigin: '' };
    spyOn(productService, 'fetchProducts').and.callThrough();
    component.loadProducts();
    expect(productService.fetchProducts).toHaveBeenCalledWith(component.filters);
    expect(component.products).toEqual([]);
  });

  it('should handle error when loading products with filters', () => {
    spyOn(productService, 'fetchProducts').and.returnValue(throwError('Error'));
    component.filters = { productName: 'Test', productType: '', countryOfOrigin: '' };
    component.loadProducts();
    expect(productService.fetchProducts).toHaveBeenCalledWith(component.filters);
    expect(component.products).toEqual([]);
  });

  it('should handle delete product', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(productService, 'deleteProduct').and.callThrough();
    spyOn(component, 'loadProducts').and.callThrough();

    component.handleDelete(1);
    expect(productService.deleteProduct).toHaveBeenCalledWith(1);
    expect(component.loadProducts).toHaveBeenCalled();
  });

  it('should handle error when deleting product', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(productService, 'deleteProduct').and.returnValue(throwError('Error'));
    spyOn(component, 'loadProducts');

    component.handleDelete(1);
    expect(productService.deleteProduct).toHaveBeenCalledWith(1);
    expect(component.loadProducts).not.toHaveBeenCalled();
  });

  it('should not delete product if confirmation is canceled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(productService, 'deleteProduct');

    component.handleDelete(1);
    expect(productService.deleteProduct).not.toHaveBeenCalled();
  });

  it('should toggle sidebar visibility', () => {
    component.showSidebar = false;
    component.toggleSidebar();
    expect(component.showSidebar).toBe(true);
    component.toggleSidebar();
    expect(component.showSidebar).toBe(false);
  });

  it('should close the sidebar', () => {
    component.showSidebar = true;
    component.closeSidebar();
    expect(component.showSidebar).toBe(false);
  });

  it('should apply filters and close sidebar', () => {
    const newFilters: ProductFilter = { productName: 'New Product', productType: '', countryOfOrigin: '' };
    spyOn(component, 'loadProducts').and.callThrough();
    component.applyFilters(newFilters);
    expect(component.filters).toEqual(newFilters);
    expect(component.showSidebar).toBe(false);
    expect(component.loadProducts).toHaveBeenCalled();
  });

  it('should navigate to product creation page', () => {
    component.handlecreate();
    expect(router.navigate).toHaveBeenCalledWith(['/product-creation']);
  });


  it('should navigate to product-update route with productId on handleUpdate', () => {
    const productId = 123;
    component.handleUpdate(productId);
    expect(router.navigate).toHaveBeenCalledWith(['/product-update', productId]);
  });

  it('should load products when sidebar is toggled on and off', () => {
    spyOn(component, 'loadProducts');
    component.showSidebar = true;
    component.toggleSidebar();
    expect(component.showSidebar).toBe(false);
    expect(component.loadProducts).not.toHaveBeenCalled();

    component.toggleSidebar();
    expect(component.showSidebar).toBe(true);
    expect(component.loadProducts).not.toHaveBeenCalled();
  });

  it('should not call fetchAllProducts if filters are applied', () => {
    spyOn(productService, 'fetchAllProducts');
    component.filters = { productName: 'Test', productType: '', countryOfOrigin: '' };
    component.loadProducts();
    expect(productService.fetchAllProducts).not.toHaveBeenCalled();
  });

  it('should handle loading products if response is empty array', () => {
    spyOn(productService, 'fetchAllProducts').and.returnValue(of([] as Product[]));
    component.loadProducts();
    expect(component.products).toEqual([]);
  });

  it('should handle loading products with filters if response is empty array', () => {
    spyOn(productService, 'fetchProducts').and.returnValue(of([] as Product[]));
    component.filters = { productName: 'Test', productType: '', countryOfOrigin: '' };
    component.loadProducts();
    expect(component.products).toEqual([]);
  });

  it('should handle empty response values correctly', () => {
    spyOn(productService, 'fetchAllProducts').and.returnValue(of({} as Product[]));
    component.loadProducts();
    expect(component.products).toEqual([]);
  });

  it('should handle empty response values with filters correctly', () => {
    spyOn(productService, 'fetchProducts').and.returnValue(of({} as Product[]));
    component.filters = { productName: 'Test', productType: '', countryOfOrigin: '' };
    component.loadProducts();
    expect(component.products).toEqual([]);
  });
});
