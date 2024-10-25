import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { LatestOrderDto } from '../../models/LatestOrderDto';

@Component({
  selector: 'app-dashboard-latest-orders',
  templateUrl: './dashboard-latest-orders.component.html',
  styleUrls: ['./dashboard-latest-orders.component.css']
})
export class DashboardLatestOrdersComponent implements OnInit {
  latestOrders: LatestOrderDto[] = [];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadLatestOrders();
  }

  loadLatestOrders(): void {
    this.dashboardService.getLatestOrders().subscribe((orders) => {
      this.latestOrders = orders;
    });
  }

}
