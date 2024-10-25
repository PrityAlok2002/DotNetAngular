import { Component } from '@angular/core';
import { Category } from '../../models/category';
import { CategoryServiceService } from '../../services/category-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  showFilter: boolean = false;
  filter: any = {
    categoryName: '',
    isActive: ''
  };


  constructor(private categoryService: CategoryServiceService, private router: Router) { }

  ngOnInit(): void {
    this.getCategories();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onInputChange() {
    if (this.filter.categoryName) {
      this.filter.categoryName = this.filter.categoryName.replace(/^\s+/, '');
    }

    if (this.filter.categoryName.length > 20) {
      this.filter.categoryName = this.filter.categoryName.substring(0, 20);
    }
    this.applyFilter();
  }

  applyFilter(): void {
    this.filterCategories();
  }

  clearActiveFilter(): void {
    this.filter.isActive = '';
    this.applyFilter();
  }

  filterCategories(): void {
    console.log(this.filter.isActive);
    this.filteredCategories = this.categories.filter(category =>
      category.categoryName.toLowerCase().includes(this.filter.categoryName.toLowerCase()) &&
      (this.filter.isActive === '' || category.isActive === (this.filter.isActive === 'active'))
    );
  }



  getCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        const categories = response.$values || [];
        this.categories = Array.isArray(categories) ? categories : [];
        this.filteredCategories = this.categories;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.categories = [];
      }
    }
    )
  }


  sortCategories(key: keyof Category): void {
    const direction = this.sortDirection[key] || 'asc';
    this.sortDirection[key] = direction === 'asc' ? 'desc' : 'asc';
    this.filteredCategories.sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  sortDirection: { [key: string]: 'asc' | 'desc' } = {};

  navigateToCategoryCreation() {
    this.router.navigate(['/category-creation']);
  }

  navigateToCategoryUpdate(categoryId: number): void {
    this.router.navigate(['/category-update', categoryId]);
  }
}
