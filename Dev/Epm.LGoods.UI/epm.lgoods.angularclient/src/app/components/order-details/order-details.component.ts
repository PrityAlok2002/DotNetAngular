import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailsService } from '../../services/order-details.service';
import { OrderDetailsDto, ProductDto, ProductImageDto } from '../../models/order-detail';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})


export class OrderDetailsComponent implements OnInit {
  order: OrderDetailsDto | null = null;
  selectedTab: string = 'overview'; // Default tab

  constructor(
    private route: ActivatedRoute,
    private orderDetailsService: OrderDetailsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.orderDetailsService.getOrderDetails(id).subscribe({
      next: (order: OrderDetailsDto) => {
        this.order = order;
      },
      error: err => {
        console.error('Error fetching order details', err);
        // Handle error appropriately here
      }
    });
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  getMainImageUrl(product: ProductDto): string | undefined {
    return product.images.find((image: ProductImageDto) => image.isMain)?.imageUrl;
  }

  onBack(): void {
    this.router.navigate(['/manage-orders']);
  }
}
