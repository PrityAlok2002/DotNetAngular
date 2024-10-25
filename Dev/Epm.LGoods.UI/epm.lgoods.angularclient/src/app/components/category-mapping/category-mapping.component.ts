



import { Component, OnInit } from '@angular/core';
import { ProductCategoryService } from '../../services/product-category.service';
import { ProductCategory } from '../../models/product-category';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-category-mapping',
  templateUrl: './category-mapping.component.html',
  styleUrls: ['./category-mapping.component.css']
})


export class CategoryMappingComponent implements OnInit {


  public categories: any[] = [];
  categoryMappings: any[] = [];
  selectedCategoryId: number | null = null;
  productId: any;
  categoryId: any;

  constructor(private route: ActivatedRoute, private productCategoryService: ProductCategoryService) { }

  ngOnInit(): void {
    this.loadCategories();

    this.route.queryParamMap.subscribe(params => {
      const p = params.get('id');
      if (p) {
        this.productId = +p; // Convert to number
        console.log('Product ID:', this.productId);
      }
    });
  }


  loadCategories(): void {
    this.productCategoryService.getCategories().subscribe((response: any) => {
      console.log("My response expected", response)
      this.categories = response.$values;
      console.log(this.categories);
      console.log('my category', this.categories,)
    });
  }


  addCategoryMapping(): void {
    this.categoryMappings.push({ categoryId: this.categoryId, productId: this.productId});

    console.log(this.categories);
    console.log(this.categoryMappings);
  }

  removeCategoryMapping(index: number): void {
    this.categoryMappings.splice(index, 1);
  }

  onCategorySelected(): void {
    // Optional: Handle any additional logic when a category is selected
    console.log('Selected Category ID:', this.selectedCategoryId);
    if (this.selectedCategoryId) {
      this.categoryId = +this.selectedCategoryId;
    }
    

  }
  

  saveMappings(): void {
    if (this.selectedCategoryId) {
      this.selectedCategoryId = +this.selectedCategoryId;
    }
    console.log(this.productId);
    const mappingData = {
      
      ProductId: this.productId,
      CategoryId:  this.selectedCategoryId
    };

    this.productCategoryService.addCategoryMapping(mappingData).subscribe({
      next: () => {
        console.log('Category mapping added successfully');
      },
      error: (err) => {
        console.error('Error adding category mapping', err);
      }
    });
  }
}
