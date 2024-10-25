import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ProductTagService } from '../../services/product-tag.service';
import { Tag } from '../../models/tag.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.css']
})
export class TagSelectorComponent implements OnInit {
  allTags: Tag[] = [];
  filteredTags: Tag[] = [];
  selectedTags: Tag[] = [];
  existingTags: Tag[] = [];
  showDropdown = false;
  inputText: string = '';
  productId: number | null = null;
  invalidInput: boolean = false;
  private readonly MAX_INPUT_LENGTH = 50;

  constructor(
    private productTagService: ProductTagService,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productTagService.getAllTags().subscribe(response => {
      this.allTags = response.$values || [];
      this.filteredTags = this.allTags;
    });

    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        this.productId = +id;
        console.log('Product ID:', this.productId);
        this.loadExistingTags();
      } else {
        console.log('No product ID provided');
        this.productId = null;
      }
    });
  }
  loadExistingTags(): void {
    if (this.productId !== null) {
      this.productTagService.getTagsForProduct(this.productId).subscribe(
        (response: any) => {
          console.log('Response from getTagsForProduct:', response);
          if (response && response.$values && Array.isArray(response.$values)) {
            this.existingTags = response.$values;
          } else {
            this.existingTags = [];
          }
          console.log('Existing tags:', this.existingTags);
        },
        (error: any) => {
          console.error('Error loading existing tags:', error);
          this.toastr.error('Failed to load existing tags for the product.', 'Error');
          this.existingTags = [];
        }
      );
    }
  }


  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
    this.filterTags();
  }

  handleInput(): void {
    if (this.inputText.length > this.MAX_INPUT_LENGTH) {
      this.inputText = this.inputText.slice(0, this.MAX_INPUT_LENGTH);
    }
    this.filterTags();
    this.showDropdown = true;
    this.invalidInput = this.inputText.trim() !== '' &&
      !this.allTags.some(tag => tag.tagName.toLowerCase() === this.inputText.toLowerCase());
  }

  filterTags(): void {
    this.filteredTags = this.allTags.filter(tag =>
      tag.tagName.toLowerCase().includes(this.inputText.toLowerCase()) &&
      !this.selectedTags.some(selectedTag => selectedTag.tagId === tag.tagId)
    );
  }

  addTag(tag: Tag, event: Event): void {
    event.stopPropagation();

    console.log('Adding tag:', tag);
    console.log('Existing tags:', this.existingTags);

    if (this.existingTags.some(t => t.tagId === tag.tagId)) {
      this.toastr.warning(`The tag "${tag.tagName}" is already associated with this product.`, 'Warning');
    } else if (!this.selectedTags.some(t => t.tagId === tag.tagId)) {
      this.selectedTags.push(tag);
      this.inputText = '';
      this.invalidInput = false;
      this.filterTags();
    }
  }



  removeTag(tag: Tag, event: Event): void {
    event.stopPropagation();
    this.selectedTags = this.selectedTags.filter(t => t.tagId !== tag.tagId);
    this.filterTags();
  }

  submitTags(): void {
    if (this.productId != null) {
      const tagIds = this.selectedTags.map(tag => tag.tagId!).filter(id => id !== undefined);
      this.productTagService.addTagsToProduct(this.productId, tagIds).subscribe(
        () => {
          this.toastr.success('Tags successfully added to the product!', 'Success');
          this.loadExistingTags(); // Reload existing tags after successful submission
          this.selectedTags = []; // Clear selected tags after successful submission
          this.filterTags(); // Refresh the filtered tags list
        },
        (error) => {
          console.error(error);
          this.toastr.error('Failed to add tags to the product. Please try again.', 'Error');
        }
      );
    }
  }

  canSubmitTags(): boolean {
    return this.selectedTags.length > 0 && !this.invalidInput && this.inputText.trim() === '';
  }

  navigateToProductTag() {
    this.router.navigate(['/product-tags']);
  }
}
