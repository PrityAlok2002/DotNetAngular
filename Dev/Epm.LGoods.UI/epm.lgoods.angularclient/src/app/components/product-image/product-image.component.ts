import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageSelectorComponent } from '../image-selector/image-selector.component';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ImageService } from '../../services/image.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-image',
  templateUrl: './product-image.component.html',
  styleUrl: './product-image.component.css'
})
export class ProductImageComponent implements OnInit {
  selectedImages: any[] = [];
  productId: any;
  errorMessage: string = '';

  @ViewChild(ImageSelectorComponent) imageSelectorComponent!: ImageSelectorComponent;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private imageService: ImageService, private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      this.productId = +id!;
        console.log('Product ID:', this.productId);
    });

    this.route.parent?.params.subscribe(params => {
      this.productId = +params['id']; // Convert to number
      if (this.productId) {
        /*this.loadImages(this.productId);*/
        console.log("loading existing images..")
      }
    });
  }

  openImageSelector() {
    const dialogRef = this.dialog.open(ImageSelectorComponent, {
      width: '80%',
      data: { selectedImages: this.selectedImages }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedImages = result;
      }
    });
  }

  removeImage(image: any) {
    this.selectedImages = this.selectedImages.filter(img => img !== image);
    console.log(this.selectedImages);
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    this.processFiles(files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      this.processFiles(files);
    }
  }

  processFiles(files: FileList) {
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64Url = e.target.result;
          const image = { image: base64Url };
          this.selectedImages.push(image);
        };
        reader.readAsDataURL(file);
      };
    }
  }


  submitImages() {
    const formData = new FormData();
    formData.append('productId', this.productId.toString());

    this.selectedImages.forEach((image, index) => {
      if (image.imageUrl) {
        formData.append(`imageUrls`, image.imageUrl);
      }
    });

    console.log('Selected Images:', this.selectedImages);

    this.selectedImages.forEach((image, index) => {
      if (image.image && image.image.startsWith('data:image/')) {
        const base64Data = image.image.split(',')[1];
        const mimeType = image.image.split(';')[0].split(':')[1];
        const file = this.base64ToFile(base64Data, mimeType, `image_${index}`);
        formData.append('files', file, file.name);
      } else if (image.image instanceof File) {
        formData.append('files', image.image, image.image.name);
      }
    });

    if (this.selectedImages[0].image == null) {
      formData.append('isMain', 'imageUrl');
    } else {
      formData.append('isMain', 'image');
    }



    this.imageService.saveSelectedImages(formData).subscribe(response => {
      console.log('Images saved successfully');
      this.snackBar?.open('Images saved successfully', 'Close', {
        duration: 6000,
        panelClass: ['success-snackbar']
      });
      this.selectedImages= [];
    },
      (error: HttpErrorResponse) => {
        this.snackBar.open('Error saving images', 'Close', {
          duration: 6000,
          panelClass: ['error-snackbar']
        });
      });
  }

  base64ToFile(base64Data: string, mimeType: string, fileName: string): File {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new File(byteArrays, fileName, { type: mimeType });
  }
}
