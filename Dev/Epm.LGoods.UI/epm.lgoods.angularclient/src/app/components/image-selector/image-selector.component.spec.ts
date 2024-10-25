import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ImageSelectorComponent } from './image-selector.component';
import { ImageService } from '../../services/image.service';

describe('ImageSelectorComponent', () => {
  let component: ImageSelectorComponent;
  let fixture: ComponentFixture<ImageSelectorComponent>;
  let imageService: ImageService;

  const dialogRefMock = {
    close: () => { },
  };

  const dataMock = {
    selectedImages: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ImageSelectorComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: dataMock },
        ImageService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSelectorComponent);
    component = fixture.componentInstance;
    imageService = TestBed.inject(ImageService);
    spyOn(imageService, 'getImages').and.returnValue(of([{ name: 'test' }]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add image to selected images if not already selected', () => {
    const image = { name: 'test' };
    component.toggleSelection(image);
    expect(component.selectedImages).toContain(image);
  });

  it('should remove image from selected images if already selected', () => {
    const image = { name: 'test' };
    component.selectedImages.push(image);
    component.toggleSelection(image);
    expect(component.selectedImages).not.toContain(image);
  });

  it('should close dialog with selected images when confirming selection', () => {
    const spyOnClose = spyOn(component.dialogRef, 'close');
    component.selectedImages.push({ name: 'test' });
    component.confirmSelection();
    expect(spyOnClose).toHaveBeenCalledWith(component.selectedImages);
  });

  it('should close dialog when closing', () => {
    const spyOnClose = spyOn(component.dialogRef, 'close');
    component.close();
    expect(spyOnClose).toHaveBeenCalled();
  });

  it('should remove image from selectedImages if image is already selected', () => {
    const image = { name: 'test' };
    component.selectedImages = [image];
    component.toggleSelection(image);
    expect(component.selectedImages.length).toBe(0);
  });

  it('should add image to selectedImages if image is not already selected', () => {
    const image = { name: 'test' };
    component.selectedImages = [];
    component.toggleSelection(image);
    expect(component.selectedImages.length).toBe(1);
    expect(component.selectedImages[0]).toEqual(image);
  });

  it('should alert and not add an image when the file size is more than 2MB', () => {
    spyOn(window, 'alert');
    const file = new File(['i'.repeat(2 * 1024 * 1024 + 1)], 'test.jpeg', { type: 'image/jpeg' });
    const event = { target: { files: [file] } };

    component.onFileSelected(event);

    expect(window.alert).toHaveBeenCalledWith('File test.jpeg is too large. Please select a file smaller than 2MB.');
    expect(component.images.length).toBe(0);
    expect(component.selectedImages.length).toBe(0);
  });

  it('should alert and not add an image when the file type is not jpeg/png', () => {
    spyOn(window, 'alert');
    const file = new File(['i'.repeat(2 * 1024 * 1024)], 'test.tiff', { type: 'image/tiff' });
    const event = { target: { files: [file] } };

    component.onFileSelected(event);

    expect(window.alert).toHaveBeenCalledWith('File test.tiff is not a valid type. Please select a JPEG or PNG image.');
    expect(component.images.length).toBe(0);
    expect(component.selectedImages.length).toBe(0);
  });

});
