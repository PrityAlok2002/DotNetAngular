import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TagService } from './tag.service';
import { Tag } from '../models/tag.model';

describe('TagService', () => {
  let service: TagService;
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:5292/api/tags';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TagService]
    });

    service = TestBed.inject(TagService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getTags', () => {
    it('should return expected tags (HttpClient called once)', () => {
      const expectedTags: Tag[] = [
        { tagId: 1, tagName: 'Tag1', taggedProducts: 10, published: true },
        { tagId: 2, tagName: 'Tag2', taggedProducts: 20, published: false }
      ];

      service.getTags().subscribe(tags => {
        expect(tags).toEqual(expectedTags);
      });

      const req = httpTestingController.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush({ $values: expectedTags });
    });

    it('should handle errors', () => {
      const errorMessage = '404 Not Found';

      service.getTags().subscribe({
        next: () => fail('expected an error, not tags'),
        error: error => {
          expect(error.message).toContain(errorMessage);
        }
      });

      const req = httpTestingController.expectOne(apiUrl);
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });

    it('should pass query parameters if provided', () => {
      const tagName = 'Tag1';
      const published = true;
      const expectedTags: Tag[] = [{ tagId: 1, tagName, taggedProducts: 10, published }];

      service.getTags(tagName, published).subscribe(tags => {
        expect(tags).toEqual(expectedTags);
      });

      const req = httpTestingController.expectOne(request => {
        return request.url === apiUrl &&
          request.params.has('tagName') &&
          request.params.get('tagName') === tagName &&
          request.params.has('published') &&
          request.params.get('published') === String(published);
      });
      req.flush({ $values: expectedTags });
    });
  });

  describe('#addTag', () => {
    it('should add a tag and return it', () => {
      const newTag: Tag = { tagId: 3, tagName: 'Tag3', taggedProducts: 30, published: true };

      service.addTag(newTag).subscribe(tag => {
        expect(tag).toEqual(newTag);
      });

      const req = httpTestingController.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTag);
      req.flush(newTag);
    });
  });

  describe('#updateTag', () => {
    it('should update a tag and return void', () => {
      const updatedTag: Tag = { tagId: 1, tagName: 'UpdatedTag', taggedProducts: 40, published: false };

      service.updateTag(updatedTag).subscribe(() => {
        // Nothing to assert, just ensure the observable completes
      });

      const req = httpTestingController.expectOne(`${apiUrl}/${updatedTag.tagId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedTag);
      req.flush({});
    });
  });

  describe('#deleteTag', () => {
    it('should delete a tag and return void', () => {
      const tagId = 1;

      service.deleteTag(tagId).subscribe(() => {
        // Nothing to assert, just ensure the observable completes
      });

      const req = httpTestingController.expectOne(`${apiUrl}/${tagId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});
