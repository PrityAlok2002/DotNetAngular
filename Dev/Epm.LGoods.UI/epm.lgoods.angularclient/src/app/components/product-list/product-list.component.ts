import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ProductFilter } from '../../models/product-filter';
import { Price } from '../../models/price.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filters: ProductFilter = {
    productName: "",
    productType: "",
    countryOfOrigin: ""
  };
  showSidebar = false;

  constructor(private productService: ProductService,private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    const isFiltersEmpty = Object.values(this.filters).every(filter => !filter);
    console.log(this.filters);
    console.log(isFiltersEmpty);
    if (isFiltersEmpty) {
      this.productService.fetchAllProducts().subscribe({
        next: (response: any) => {
          const productList = response.$values || [];
          this.products = Array.isArray(productList) ? productList : [];
        },
        error: (error) => {
          console.error('Error fetching products:', error);
          this.products = [];
        }
      });
    } else {
      this.productService.fetchProducts(this.filters).subscribe({
        next: (response: any) => {
          const productList = response.$values || [];
          this.products = Array.isArray(productList) ? productList : [];
        },
        error: (error) => {
          console.error('Error fetching products:', error);
          this.products = [];
        }
      });
    }
  }

  handleDelete(productId: number): void {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this product?");
    if (confirmDelete) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => this.loadProducts(),
        error: (error) => console.error('Error deleting product:', error)
      });
    }
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  closeSidebar(): void {
    this.showSidebar = false;
  }

  applyFilters(newFilters: ProductFilter): void {
    this.filters = newFilters;
    this.closeSidebar();
    this.loadProducts();
  }

  handlecreate(): void {
    this.router.navigate(['/product-creation']);
  }
  handleUpdate(productId: number): void {
    console.log('Navigating to product-creation with productId:', productId);
    this.router.navigate(['/product-update',productId])
  }

  navigateToTagSelector(productId: number): void {
    console.log(productId);
    this.router.navigate([`/product-layout/${productId}`]);
  }
}
