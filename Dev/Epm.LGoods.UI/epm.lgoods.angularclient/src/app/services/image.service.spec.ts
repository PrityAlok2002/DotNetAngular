import { TestBed } from '@angular/core/testing';

import { ImageService } from './image.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

describe('ImageService', () => {
  let service: ImageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImageService]
    });
    service = TestBed.inject(ImageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save selected images', () => {
    const formData = new FormData();
    formData.append('productId', '1');
    formData.append('files', new Blob(['file content'], { type: 'image/jpeg' }), 'image.jpg');

    service.saveSelectedImages(formData).subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/ProductImage`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(formData);
    req.flush({ success: true });
  });

  it('should handle error response when saving selected images', () => {
    const formData = new FormData();
    formData.append('productId', '1');
    formData.append('files', new Blob(['file content'], { type: 'image/jpeg' }), 'image.jpg');

    service.saveSelectedImages(formData).subscribe(
      () => fail('should have failed with 400 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(400);
        expect(error.error.errors.image).toContain('Invalid image');
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/ProductImage`);
    req.flush({ errors: { image: ['Invalid image'] } }, { status: 400, statusText: 'Bad Request' });
  });

  it('should get images', () => {
    const dummyImages = {
      $values: [
        { id: 1, imageUrl: 'image1.jpg' },
        { id: 2, imageUrl: 'image2.jpg' }
      ]
    };

    service.getImages().subscribe(images => {
      expect(images.$values.length).toBe(2);
      expect(images.$values).toEqual(dummyImages.$values);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/ProductImage`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyImages);
  });
});
