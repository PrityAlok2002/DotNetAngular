import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-stock-level',
  templateUrl: './stock-level.component.html',
  styleUrls: ['./stock-level.component.css']
})
export class StockLevelComponent implements OnInit {
  lowStockProducts: Product[] = [];
  sortDirection: { [key: string]: 'asc' | 'desc' } = {};

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getLowStockProducts().subscribe(data => {
      if (data && Array.isArray(data.$values)) {
        this.lowStockProducts = data.$values;
      } else {
        console.error('Expected array but got:', data);
        this.lowStockProducts = [];
      }
    }, error => {
      console.error('Error fetching low stock products:', error);
    });
  }


  sortProducts(key: keyof Product): void {
    const direction = this.sortDirection[key] || 'asc';
    this.sortDirection[key] = direction === 'asc' ? 'desc' : 'asc';
    this.lowStockProducts.sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
