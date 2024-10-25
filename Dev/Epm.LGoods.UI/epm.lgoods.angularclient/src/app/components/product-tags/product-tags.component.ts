import { Component, OnInit } from '@angular/core';
import { TagService } from '../../services/tag.service';
import { Tag } from '../../models/tag.model';

@Component({
  selector: 'app-product-tags',
  templateUrl: './product-tags.component.html',
  styleUrls: ['./product-tags.component.css']
})
export class ProductTagsComponent implements OnInit {
  showConfirmPopup = false;
  tagIdToDelete?: number;

  filterOpen = false; // Ensure this matches the HTML
  tags: Tag[] = [];
  newTag: Tag = {
    tagName: '',
    taggedProducts: 0,
    published: false
  };
  filter = {
    tagName: '',
    published: 'Unspecified'
  };

  noDataFound = false; // Flag for displaying "No Data Found"

  sortDirection: 'asc' | 'desc' = 'asc'; 

  constructor(private tagService: TagService) { }

  ngOnInit(): void {
    this.loadTags();
  }

  toggleFilter(): void {
    this.filterOpen = !this.filterOpen;
  }

  loadTags(): void {
    const { tagName, published } = this.filter;
    const publishedFilter = published === 'Unspecified' ? undefined : (published === 'true');

    this.tagService.getTags(tagName, publishedFilter).subscribe({
      next: (tags: Tag[]) => {
        if (Array.isArray(tags)) {
          this.tags = tags;
          this.noDataFound = this.tags.length === 0; // Update flag based on data
        } else {
          console.error('Expected an array of tags but received:', tags);
          this.noDataFound = true; // Set to true in case of unexpected data format
        }
      },
      error: (error) => {
        console.error('Error loading tags:', error);
        this.noDataFound = true; // Set to true in case of error
      }
    });
  }

  applyFilter(): void {
    if (!this.isTagNameValid(this.filter.tagName)) {
      console.error('Invalid filter tag name:', this.filter.tagName);
      return;
    }
    this.loadTags();
  }

  resetFilter(): void {
    this.filter = {
      tagName: '',
      published: 'Unspecified'
    };
    this.loadTags();
  }

  addTag(): void {
    if (!this.isTagNameValid(this.newTag.tagName)) {
      console.error('Invalid tag name:', this.newTag.tagName);
      return;
    }

    if (!this.isTaggedProductsValid(this.newTag.taggedProducts)) {
      console.error('Invalid tagged products:', this.newTag.taggedProducts);
      return;
    }

    
    const publishedBoolean = (typeof this.newTag.published === 'string')
      ? this.newTag.published === 'true'
      : this.newTag.published;

    const tagData = {
      tagName: this.newTag.tagName,
      taggedProducts: this.newTag.taggedProducts,
      published: publishedBoolean
    };

    console.log('Sending tag data:', tagData); 

    this.tagService.addTag(tagData).subscribe({
      next: () => {
        this.loadTags();
        this.newTag = {
          tagName: '',
          taggedProducts: 0,
          published: false
        };
      },
      error: (error) => {
        console.error('Error adding tag:', error);
      }
    });
  }

  updateTag(tag: Tag): void {
    this.tagService.updateTag(tag).subscribe(() => {
      this.loadTags();
    });
  }

  deleteTag(tagId?: number): void {
    if (tagId !== undefined) {
      const confirmation = confirm('Are you sure you want to delete this tag? This action cannot be undone.');

      if (confirmation) {
        this.tagService.deleteTag(tagId).subscribe(() => {
          this.loadTags();
        });
      } else {
        console.log('Deletion cancelled.');
      }
    }
  }

  // Method to sort tags by tagName
  sortTags(tags: Tag[], direction: 'asc' | 'desc'): Tag[] {
    return tags.sort((a, b) => {
      const comparison = a.tagName.localeCompare(b.tagName);
      return direction === 'asc' ? comparison : -comparison;
    });
  }

  // Toggle sort direction
  toggleSort(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.tags = this.sortTags(this.tags, this.sortDirection);
  }

  validateTaggedProducts(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove any non-digit characters
    let cleanedValue = value.replace(/\D/g, '');

    // Limit the length to 10 digits
    if (cleanedValue.length > 10) {
      cleanedValue = cleanedValue.slice(0, 10);
    }

    // Update the model value
    this.newTag.taggedProducts = cleanedValue ? parseInt(cleanedValue, 10) : 0;

    // Set the cleaned value back to the input
    input.value = this.newTag.taggedProducts.toString();
  }

  validateTagName(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove any non-alphanumeric characters
    let cleanedValue = value.replace(/[^a-zA-Z0-9]/g, '');

    // Limit the length to 30 characters
    if (cleanedValue.length > 30) {
      cleanedValue = cleanedValue.slice(0, 30);
    }

    // Update the model value
    this.newTag.tagName = cleanedValue;

    // Set the cleaned value back to the input
    input.value = this.newTag.tagName;
  }

  validateFilterTagName(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove any non-alphanumeric characters
    let cleanedValue = value.replace(/[^a-zA-Z0-9]/g, '');

    // Limit the length to 30 characters
    if (cleanedValue.length > 30) {
      cleanedValue = cleanedValue.slice(0, 30);
    }

    // Update the model value
    this.filter.tagName = cleanedValue;

    // Set the cleaned value back to the input
    input.value = this.filter.tagName;
  }




  public isTagNameValid(tagName: string): boolean {
    return /^[a-zA-Z0-9]{1,30}$/.test(tagName);
  }

  // Validate tagged products (number with up to 10 digits)
  public isTaggedProductsValid(taggedProducts: number): boolean {
    return /^[0-9]{1,10}$/.test(taggedProducts.toString());                                                                                                                                                                         
  }

  showConfirmationPopup(tagId: number): void {
    this.tagIdToDelete = tagId;
    this.showConfirmPopup = true;
  }

  confirmDelete(): void {
    if (this.tagIdToDelete !== undefined) {
      this.tagService.deleteTag(this.tagIdToDelete).subscribe(() => {
        this.loadTags();
      });
      this.tagIdToDelete = undefined;
    }
    this.showConfirmPopup = false;
  }

  cancelDelete(): void {
    this.tagIdToDelete = undefined;
    this.showConfirmPopup = false;
  }
}
