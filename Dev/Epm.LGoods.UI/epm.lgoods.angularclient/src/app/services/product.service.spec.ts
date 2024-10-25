import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product';
import { ProductFilter } from '../models/product-filter';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5292/api/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('#createProduct', () => {
    it('should send a POST request with FormData', () => {
      const formData = new FormData();
      formData.append('key', 'value');

      service.createProduct(formData).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush({}); 
    });
  });

  describe('#fetchAllProducts', () => {
    it('should fetch all products', () => {
      const mockProducts: Product[] = [{
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
      }];

      service.fetchAllProducts().subscribe(products => {
        expect(products.length).toBe(1);
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });

  describe('#fetchProducts', () => {
    it('should fetch products with filters', () => {
      const filters: ProductFilter = {
        productName: 'Product Name',
        productType: 'Type A',
        countryOfOrigin: 'Country'
      };

      const mockProducts: Product[] = [{
        productId: 1,
        productName: 'Product Name',
        productType: 'Type A',
        shortDescription: 'Description',
        mfgDate: new Date(),
        expiryDate: new Date(),
        countryOfOrigin: 'Country',
        stockQuantity: 10,
        weight: 1.5,
        length: 10,
        width: 5,
        height: 5
      }];

      service.fetchProducts(filters).subscribe(products => {
        expect(products.length).toBe(1);
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne(request => {
        const params = request.params;
        return request.method === 'GET' &&
          params.get('productName') === 'Product Name' &&
          params.get('productType') === 'Type A' &&
          params.get('countryOfOrigin') === 'Country';
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should handle filters with missing optional properties', () => {
      const filters: ProductFilter = {
        productName: 'Product Name',
        productType: 'Type A',
        countryOfOrigin: ''
      };

      const mockProducts: Product[] = [{
        productId: 1,
        productName: 'Product Name',
        productType: 'Type A',
        shortDescription: 'Description',
        mfgDate: new Date(),
        expiryDate: new Date(),
        countryOfOrigin: 'Country',
        stockQuantity: 10,
        weight: 1.5,
        length: 10,
        width: 5,
        height: 5
      }];

      service.fetchProducts(filters).subscribe(products => {
        expect(products.length).toBe(1);
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne(request => {
        const params = request.params;
        return request.method === 'GET' &&
          params.get('productName') === 'Product Name' &&
          params.get('productType') === 'Type A' &&
          (params.get('countryOfOrigin') === '' || params.get('countryOfOrigin') === null);
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });

  describe('#deleteProduct', () => {
    it('should send a DELETE request', () => {
      const productId = 1;

      service.deleteProduct(productId).subscribe(response => {
        expect(response).toBeNull(); 
      });

      const req = httpMock.expectOne(`${apiUrl}/${productId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null); 
    });
  });

  describe('#getLowStockProducts', () => {
    it('should fetch products with low stock', () => {
      const mockLowStockProducts: { $values: Product[] } = {
        $values: [
          {
            productId: 1,
            productName: 'Product 1',
            productType: 'Type 1',
            shortDescription: 'Description 1',
            mfgDate: new Date(),
            expiryDate: new Date(),
            countryOfOrigin: 'Country 1',
            stockQuantity: 20,
            weight: 1.0,
            length: 10,
            width: 5,
            height: 5
          }
        ]
      };

      service.getLowStockProducts().subscribe(data => {
        expect(data.$values.length).toBe(1);
        expect(data.$values).toEqual(mockLowStockProducts.$values);
      });

      const req = httpMock.expectOne(`${apiUrl}/low-stock`);
      expect(req.request.method).toBe('GET');
      req.flush(mockLowStockProducts);
    });

    it('should handle an empty response for low stock products', () => {
      const mockLowStockProducts: { $values: Product[] } = { $values: [] };

      service.getLowStockProducts().subscribe(data => {
        expect(data.$values.length).toBe(0);
        expect(data.$values).toEqual([]);
      });

      const req = httpMock.expectOne(`${apiUrl}/low-stock`);
      expect(req.request.method).toBe('GET');
      req.flush(mockLowStockProducts);
    });

    it('should handle errors when fetching low stock products', () => {
      const errorMessage = 'Error fetching low stock products';

      service.getLowStockProducts().subscribe(
        data => fail('should have failed with the error message'),
        error => {
          expect(error).toBeTruthy();
          expect(error.statusText).toBe('Internal Server Error');
        }
      );

      const req = httpMock.expectOne(`${apiUrl}/low-stock`);
      expect(req.request.method).toBe('GET');
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('#updateProduct', () => {
    it('should send a PUT request with FormData', () => {
      const productId = 1;
      const formData = new FormData();
      formData.append('key', 'value');

      service.updateProduct(productId, formData).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/${productId}`);
      expect(req.request.method).toBe('PUT');
      req.flush({});
    });
  });


  describe('#fetchProductById', () => {
    it('should fetch a product by id', () => {
      const productId = 1;
      const mockProduct: Product = {
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
      };

      service.fetchProductById(productId).subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${apiUrl}/${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });
  });


});
