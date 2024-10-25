import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageService } from '../../services/image.service';


@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrl: './image-selector.component.css'
})
export class ImageSelectorComponent {
  images: any[] = [];
  selectedImages: any[] = [];

  isOpen: boolean = true;

  constructor(
    private imageService: ImageService,
    public dialogRef: MatDialogRef<ImageSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedImages = [...data.selectedImages];
    this.loadImages();
  }

  loadImages() {
    this.imageService.getImages().subscribe(images => {
      this.images = images.$values;
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.size > 2 * 1024 * 1024) { 
          alert(`File ${file.name} is too large. Please select a file smaller than 2MB.`);
          continue; 
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
          alert(`File ${file.name} is not a valid type. Please select a JPEG or PNG image.`);
          continue; 
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64Url = e.target.result;
          const image = { image: base64Url };
          this.images.push(image);
          this.selectedImages.push(image);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  toggleSelection(image: any) {
    const index = this.selectedImages.indexOf(image);
    if (index >= 0) {
      this.selectedImages.splice(index, 1);
    } else {
      this.selectedImages.push(image);
    }
  }


  confirmSelection() {
    this.dialogRef.close(this.selectedImages);
  }

  close() {
    this.dialogRef.close();
  }
}
