import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ImageService } from '../../services/image.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductImageComponent } from './product-image.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ImageSelectorComponent } from '../image-selector/image-selector.component';
import { HttpErrorResponse } from '@angular/common/http';

describe('ProductImageComponent', () => {
  let component: ProductImageComponent;
  let fixture: ComponentFixture<ProductImageComponent>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let route: ActivatedRoute;
  let imageService: jasmine.SpyObj<ImageService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const imageServiceSpy = jasmine.createSpyObj('ImageService', ['saveSelectedImages']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ProductImageComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ActivatedRoute, useValue: { queryParamMap: of({ get: () => '1' }) } },
        { provide: ImageService, useValue: imageServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductImageComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    route = TestBed.inject(ActivatedRoute);
    imageService = TestBed.inject(ImageService) as jasmine.SpyObj<ImageService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get product id from query params', () => {
    component.ngOnInit();
    expect(component.productId).toBe(1);
  });

  it('should open image selector dialog', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of([]), close: null });
    dialog.open.and.returnValue(dialogRefSpyObj);

    component.openImageSelector();
    expect(dialog.open).toHaveBeenCalledWith(ImageSelectorComponent, {
      width: '80%',
      data: { selectedImages: component.selectedImages }
    });
  });

  it('should remove selected image', () => {
    const image = { imageUrl: 'test.jpg' };
    component.selectedImages = [image];
    component.removeImage(image);
    expect(component.selectedImages.length).toBe(0);
  });

  it('should submit images and handle success response', () => {
    imageService.saveSelectedImages.and.returnValue(of({}));
    component.selectedImages = [{ imageUrl: 'test.jpg', image: 'data:image/jpeg;base64,test' }];

    component.submitImages();
    expect(imageService.saveSelectedImages).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith('Images saved successfully', 'Close', {
      duration: 6000,
      panelClass: ['success-snackbar']
    });
    expect(component.selectedImages).toEqual([]);
  });


  it('should convert base64 to file', () => {
    const base64Data = 'dGVzdA==';
    const mimeType = 'image/jpeg';
    const fileName = 'test.jpg';
    const file = component.base64ToFile(base64Data, mimeType, fileName);

    expect(file.name).toBe(fileName);
    expect(file.type).toBe(mimeType);
  });


  it('should prevent default behavior on drag over', () => {
    const event = { preventDefault: jasmine.createSpy('preventDefault') } as unknown as DragEvent;

    component.onDragOver(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });


  it('should process dropped files', () => {
    const file = new File([''], 'test-image.jpg', { type: 'image/jpeg' });
    const dataTransfer = { files: [file] as unknown as FileList } as DataTransfer;
    const event = { preventDefault: jasmine.createSpy('preventDefault'), dataTransfer } as unknown as DragEvent;

    spyOn(component, 'processFiles');

    component.onDrop(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.processFiles).toHaveBeenCalledWith(dataTransfer.files);
  });



  it('should process selected files', () => {
    const file = new File([''], 'test-image.jpg', { type: 'image/jpeg' });
    const fileList = [file] as unknown as FileList;
    const event = { target: { files: fileList } } as unknown as Event;

    spyOn(component, 'processFiles');

    component.onFileSelected(event);

    expect(component.processFiles).toHaveBeenCalledWith(fileList);
  });

  it('should process files', () => {
    const file = new File([''], 'test-image.jpg', { type: 'image/jpeg' });
    const fileList = [file] as unknown as FileList;

    component.processFiles(fileList);

    expect(component.selectedImages.length).toBe(0);
  });

});
