import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductCategoryService } from './product-category.service';

describe('ProductCategoryService', () => {
  let service: ProductCategoryService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductCategoryService]
    });
    service = TestBed.inject(ProductCategoryService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // verifies that no requests are outstanding.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all categories', () => {
    const mockCategories = [{ id: 1, name: "Category1" }, { id: 2, name: "Category2" }];

    service.getCategories().subscribe(categories => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(mockCategories);
    });

    const req = httpTestingController.expectOne('http://localhost:5292/api/ProductCategory');
    expect(req.request.method).toEqual('GET');

    req.flush(mockCategories); // provide dummy values as a response.
  });

  it('should add a category mapping', () => {
    const mappingData = { categoryId: 1, productId: 1 };

    service.addCategoryMapping(mappingData).subscribe();

    const req = httpTestingController.expectOne('http://localhost:5292/api/ProductCategory/saveMappings');
    expect(req.request.method).toEqual('POST');

    req.flush(null); // provides a dummy value as a response
  });

  it('should remove a category mapping', () => {
    const mappingData = { categoryId: 1, productId: 1 };

    service.removeCategoryMapping(mappingData).subscribe();

    const req = httpTestingController.expectOne('http://localhost:5292/api/ProductCategory/remove');
    expect(req.request.method).toEqual('POST');

    req.flush(null); // provides a dummy value as a response
  });


  it('should add a category mapping', () => {
    const mappingData = { categoryId: 1, productId: 1 };

    service.addCategoryMapping(mappingData).subscribe();

    const req = httpTestingController.expectOne(`${service.apiUrl}/saveMappings`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(mappingData);

    req.flush(null); // provides a dummy value as a response
  });

  it('should remove a category mapping', () => {
    const mappingData = { categoryId: 1, productId: 1 };

    service.removeCategoryMapping(mappingData).subscribe();

    const req = httpTestingController.expectOne(`${service.apiUrl}/remove`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(mappingData);

    req.flush(null); // provides a dummy value as a response
  });



});
