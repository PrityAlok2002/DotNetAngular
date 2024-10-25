import { Component } from '@angular/core';
import { Order } from '../../models/order';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrl: './shipment.component.css'
})
export class ShipmentComponent {
  shipments: Order[] = [];

  constructor(private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    this.loadShipments();
  }

  loadShipments(): void {
    this.orderService.getAllOrders().subscribe(
      (orders: Order[]) => {
        this.shipments = orders.filter(order => order.dateShipped && order.dateShipped !== '');
      },
      (error) => {
        console.error('Error loading shipments:', error);
      }
    );
  }
}
