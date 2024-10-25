import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryServiceService } from './category-service.service';

describe('CategoryServiceService', () => {
  let service: CategoryServiceService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5292/api/products/Category';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryServiceService]
    });

    service = TestBed.inject(CategoryServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get categories', () => {
    const dummyCategories = [{ id: 1, name: 'Electronics' }, { id: 2, name: 'Books' }];

    service.getCategories().subscribe(categories => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(dummyCategories);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCategories);
  });

  it('should create a category', () => {
    const dummyCategory = { id: 1, name: 'Clothing' };
    const formData = new FormData();
    formData.append('name', 'Clothing');

    service.createCategory(formData).subscribe(category => {
      expect(category).toEqual(dummyCategory);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(formData);
    req.flush(dummyCategory);
  });

  it('should update a category', () => {
    const categoryId = 1;
    const dummyCategory = { id: 1, name: 'Updated Clothing' };
    const formData = new FormData();
    formData.append('name', 'Updated Clothing');

    service.updateCategory(categoryId, formData).subscribe(category => {
      expect(category).toEqual(dummyCategory);
    });

    const req = httpMock.expectOne(`${apiUrl}/${categoryId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(formData);
    req.flush(dummyCategory);
  });

  it('should get a category by ID', () => {
    const categoryId = 1;
    const dummyCategory = { id: 1, name: 'Electronics' };

    service.getCategoryById(categoryId).subscribe(category => {
      expect(category).toEqual(dummyCategory);
    });

    const req = httpMock.expectOne(`${apiUrl}/${categoryId}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCategory);
  });

  it('should validate a category name', () => {
    const categoryName = 'Electronics';
    const isValid = true;

    service.validateCategoryName(categoryName).subscribe(result => {
      expect(result).toBe(isValid);
    });

    const encodedName = encodeURIComponent(categoryName);
    const req = httpMock.expectOne(`${apiUrl}/validate?name=${encodedName}`);
    expect(req.request.method).toBe('GET');
    req.flush(isValid);
  });
});
