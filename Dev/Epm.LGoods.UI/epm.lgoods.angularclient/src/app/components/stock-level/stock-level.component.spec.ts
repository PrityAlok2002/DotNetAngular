import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockLevelComponent } from './stock-level.component';
import { ProductService } from '../../services/product.service';
import { of, throwError } from 'rxjs';
import { Product } from '../../models/product';

describe('StockLevelComponent', () => {
  let component: StockLevelComponent;
  let fixture: ComponentFixture<StockLevelComponent>;
  let productService: ProductService;
  
  const mockLowStockProducts = { 
    $values: [
      { 
        productId: 1,
        productName: 'Product 1',
        productType: 'Type 1',
        shortDescription: 'Description 1',
        mfgDate: new Date(),
        expiryDate: new Date(),
        countryOfOrigin: 'Country 1',
        stockQuantity: 10,
        weight: 1.0,
        length: 10,
        width: 5,
        height: 5
      },
      { 
        productId: 2,
        productName: 'Product 2',
        productType: 'Type 2',
        shortDescription: 'Description 2',
        mfgDate: new Date(),
        expiryDate: new Date(),
        countryOfOrigin: 'Country 2',
        stockQuantity: 5,
        weight: 2.0,
        length: 15,
        width: 10,
        height: 8
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockLevelComponent ],
      providers: [
        { provide: ProductService, useValue: { getLowStockProducts: () => of(mockLowStockProducts) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockLevelComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
  });

  describe('getProducts', () => {
    it('should fetch low stock products and populate lowStockProducts', () => {
      spyOn(productService, 'getLowStockProducts').and.returnValue(of(mockLowStockProducts));
      component.getProducts();
      fixture.detectChanges();
      expect(component.lowStockProducts.length).toBe(2);
      expect(component.lowStockProducts).toEqual(mockLowStockProducts.$values);
    });

    it('should handle error when fetching low stock products', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      spyOn(productService, 'getLowStockProducts').and.returnValue(throwError('Error fetching low stock products'));
      component.getProducts();
      fixture.detectChanges();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching low stock products:', 'Error fetching low stock products');
      expect(component.lowStockProducts.length).toBe(0);
    });

    it('should handle unexpected data structure', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      const unexpectedData: any = { unexpectedKey: [] }; 
      spyOn(productService, 'getLowStockProducts').and.returnValue(of(unexpectedData));
      component.getProducts();
      fixture.detectChanges();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Expected array but got:', unexpectedData);
      expect(component.lowStockProducts.length).toBe(0);
    });
  });




  describe('sortProducts', () => {
    beforeEach(() => {
      component.lowStockProducts = [...mockLowStockProducts.$values];
    });

    it('should sort products by productName in descending order', () => {
      component.sortProducts('productName');
      fixture.detectChanges();
      component.sortProducts('productName'); 
      fixture.detectChanges();
      expect(component.lowStockProducts[0].productName).toBe('Product 2');
      expect(component.lowStockProducts[1].productName).toBe('Product 1');
    });


    it('should sort products by stockQuantity in descending order', () => {
      component.sortProducts('stockQuantity');
      fixture.detectChanges();
      component.sortProducts('stockQuantity');
      fixture.detectChanges();
      expect(component.lowStockProducts[0].stockQuantity).toBe(10);
      expect(component.lowStockProducts[1].stockQuantity).toBe(5);
    });

    it('should sort products by mfgDate in ascending order', () => {
      component.sortProducts('mfgDate');
      fixture.detectChanges();
      expect(component.lowStockProducts[0].mfgDate).toEqual(mockLowStockProducts.$values[1].mfgDate); 
      expect(component.lowStockProducts[1].mfgDate).toEqual(mockLowStockProducts.$values[0].mfgDate); 
    });

    it('should sort products by mfgDate in descending order', () => {
      component.sortProducts('mfgDate');
      fixture.detectChanges();
      component.sortProducts('mfgDate');
      fixture.detectChanges();
      expect(component.lowStockProducts[0].mfgDate).toEqual(mockLowStockProducts.$values[0].mfgDate); 
      expect(component.lowStockProducts[1].mfgDate).toEqual(mockLowStockProducts.$values[1].mfgDate); 
    });

    it('should sort products by expiryDate in ascending order', () => {
      component.sortProducts('expiryDate');
      fixture.detectChanges();
      expect(component.lowStockProducts[0].expiryDate).toEqual(mockLowStockProducts.$values[1].expiryDate); 
      expect(component.lowStockProducts[1].expiryDate).toEqual(mockLowStockProducts.$values[0].expiryDate); 
    });

    it('should sort products by expiryDate in descending order', () => {
      component.sortProducts('expiryDate');
      fixture.detectChanges();
      component.sortProducts('expiryDate');
      fixture.detectChanges();
      expect(component.lowStockProducts[0].expiryDate).toEqual(mockLowStockProducts.$values[0].expiryDate); 
      expect(component.lowStockProducts[1].expiryDate).toEqual(mockLowStockProducts.$values[1].expiryDate); 
    });
  });

  describe('ngOnInit', () => {
    it('should call getProducts on initialization', () => {
      const getProductsSpy = spyOn(component, 'getProducts');
      component.ngOnInit();
      expect(getProductsSpy).toHaveBeenCalled();
    });
  });
});
