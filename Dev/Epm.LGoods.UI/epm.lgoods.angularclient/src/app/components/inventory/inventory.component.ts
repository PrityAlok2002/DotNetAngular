import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'] // Fixed 'styleUrl' to 'styleUrls'
})
export class InventoryComponent implements OnInit {
  inventoryForm!: FormGroup;
  inventoryId: number;
  productId!: number;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.inventoryId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    // Subscribe to query parameters to get the productId
    this.route.queryParamMap.subscribe(params => {
      const p = params.get('id');
      if (p) {
        this.productId = +p; // Convert to number
        console.log('Product ID:', this.productId);

        // Initialize the form with the productId
        this.initializeForm();
      }
    });
  }

  initializeForm(): void {
    this.inventoryForm = this.fb.group({
      productId: [this.productId, Validators.required], // Initialize with productId
      minimumCartQuantity: [
        '',
        [
          Validators.required,
          Validators.pattern('^[1-9][0-9]{0,2}$|^1000$') // Pattern to ensure no decimal points and valid range
        ]
      ],
      maximumCartQuantity: [
        '',
        [
          Validators.required,
          Validators.pattern('^[1-9][0-9]{0,2}$|^1000$') // Pattern to ensure no decimal points and valid range
        ]
      ],
      quantityStep: [
        '',
        [
          Validators.required,
          Validators.pattern('^[1-9]|10$') // Pattern to ensure no decimal points and valid range
        ]
      ]
    });
  }

  onMinimumCartQuantityChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart ?? 0;
    const sanitizedValue = input.value.replace(/[^0-9]/g, '');
    const minQuantity = Number(sanitizedValue);

    if (sanitizedValue === '' || minQuantity < 1 || minQuantity > 1000) {
      this.inventoryForm.get('minimumCartQuantity')?.setErrors({ invalidRange: true });
      this.inventoryForm.get('minimumCartQuantity')?.markAsTouched();
      input.value = '';
    } else {
      this.inventoryForm.get('minimumCartQuantity')?.setErrors(null);
      this.inventoryForm.get('minimumCartQuantity')?.setValue(minQuantity, { emitEvent: false });

      // Validate maximum quantity based on the new minimum quantity
      const maxQuantity = this.inventoryForm.get('maximumCartQuantity')?.value;
      if (maxQuantity !== null && minQuantity >= maxQuantity) {
        this.inventoryForm.get('maximumCartQuantity')?.setErrors({ minInvalid: true });
        this.inventoryForm.get('maximumCartQuantity')?.markAsTouched();
      } else {
        this.inventoryForm.get('maximumCartQuantity')?.setErrors(null);
      }
    }

    // Restore cursor position immediately after updating the input value
    input.setSelectionRange(cursorPosition, cursorPosition);
  }

  onMaximumCartQuantityChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart ?? 0;
    const sanitizedValue = input.value.replace(/[^0-9]/g, '');
    const maxQuantity = Number(sanitizedValue);

    if (sanitizedValue === '' || maxQuantity < 1 || maxQuantity > 1000) {
      this.inventoryForm.get('maximumCartQuantity')?.setErrors({ invalidRange: true });
      this.inventoryForm.get('maximumCartQuantity')?.markAsTouched();
      input.value = '';
    } else {
      this.inventoryForm.get('maximumCartQuantity')?.setErrors(null);
      this.inventoryForm.get('maximumCartQuantity')?.setValue(maxQuantity, { emitEvent: false });

      // Ensure minimum quantity is less than maximum quantity
      const minQuantity = this.inventoryForm.get('minimumCartQuantity')?.value;
      if (minQuantity !== null && maxQuantity <= minQuantity) {
        this.inventoryForm.get('maximumCartQuantity')?.setErrors({ maxInvalid: true });
        this.inventoryForm.get('maximumCartQuantity')?.markAsTouched();
      } else {
        this.inventoryForm.get('minimumCartQuantity')?.setErrors(null);
      }
    }

    // Restore cursor position immediately after updating the input value
    input.setSelectionRange(cursorPosition, cursorPosition);
  }

  onQuantityStepChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart ?? 0;
    const sanitizedValue = input.value.replace(/[^0-9]/g, '');
    const value = Number(sanitizedValue);

    if (sanitizedValue === '' || value < 1 || value > 10) {
      this.inventoryForm.get('quantityStep')?.setErrors({ invalidRange: true });
      this.inventoryForm.get('quantityStep')?.markAsTouched();
      input.value = '';
    } else {
      this.inventoryForm.get('quantityStep')?.setErrors(null);
      this.inventoryForm.get('quantityStep')?.setValue(value, { emitEvent: false });
    }

    // Restore cursor position immediately after updating the input value
    input.setSelectionRange(cursorPosition, cursorPosition);
  }

  loadInventory(): void {
    // Load the inventory data (if needed) using this.inventoryId
    // For simplicity, this is not shown here.
  }

  onSubmit(): void {
    this.inventoryForm.markAllAsTouched();

    if (this.inventoryForm.invalid) {
      this.snackBar.open('Please correct the errors in the form before submitting.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
      return;
    }

    const newInventory = this.inventoryForm.value;

    this.inventoryService.createInventory(newInventory).subscribe({
      next: (response) => {
        console.log('Inventory created successfully:', response);
        console.log('Form data:', this.inventoryForm.value);

        this.snackBar.open('Inventory created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/product-layout/inventory']);
      },
      error: (error) => {
        console.error('Failed to create inventory:', error);
        console.log('Form data on error:', this.inventoryForm.value);

        this.snackBar.open('Failed to create inventory', 'Close', { duration: 3000 });
      }
    });
  }
}
