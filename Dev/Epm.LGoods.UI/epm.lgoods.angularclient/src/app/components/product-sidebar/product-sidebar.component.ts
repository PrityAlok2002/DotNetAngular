import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-sidebar',
  templateUrl: './product-sidebar.component.html',
  styleUrl: './product-sidebar.component.css'
})
export class ProductSidebarComponent {
  productId: number | null = null;
  id: number | null = null;
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      this.productId = params['id'] ? +params['id'] : null;
    });

    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      this.id = +id!;
      console.log('Product ID:', this.productId);
    });
  }

  getLink(path: string): string {
    if (this.productId) {
      return `/product-layout/${this.productId}/${path}`;
    } else {
      return `/product-layout/${path}`;
    }
  }


}
