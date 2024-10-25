import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductTagService } from './product-tag.service';
import { Tag } from '../models/tag.model';

describe('ProductTagService', () => {
  let service: ProductTagService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://mock-api-url'; // Mock API URL for testing

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductTagService]
    });
    service = TestBed.inject(ProductTagService);
    httpMock = TestBed.inject(HttpTestingController);
    service['apiUrl'] = apiUrl; // Set the mock API URL directly
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that no unexpected HTTP requests were made
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all tags from the API via GET', () => {
    const mockTags: { $values: Tag[] } = {
      $values: [
        { tagId: 1, tagName: 'Electronics', taggedProducts: 10, published: true },
        { tagId: 2, tagName: 'Books', taggedProducts: 5, published: false }
      ]
    };

    service.getAllTags().subscribe(tags => {
      expect(tags.$values.length).toBe(2);
      expect(tags.$values).toEqual(mockTags.$values);
    });

    const req = httpMock.expectOne(`${apiUrl}/tags`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTags);
  });

  it('should add tags to a product via POST', () => {
    const productId = 123;
    const tagIds = [1, 2];
    const dto = { productId, tagIds };

    service.addTagsToProduct(productId, tagIds).subscribe(response => {
      expect(response).toBeNull(); // updated to expect null
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/addTags`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    // Simulating a void response where a null is returned
    req.flush(null);
  });

  it('should retrieve tags for a product via GET', () => {
    const productId = 123;
    const mockTags: Tag[] = [
      { tagId: 1, tagName: 'Electronics', taggedProducts: 10, published: true },
      { tagId: 2, tagName: 'Books', taggedProducts: 5, published: false }
    ];

    service.getTagsForProduct(productId).subscribe(tags => {
      expect(tags.length).toBe(2);
      expect(tags).toEqual(mockTags);
    });

    const req = httpMock.expectOne(`${apiUrl}/product/${productId}/tags`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTags);
  });
});
