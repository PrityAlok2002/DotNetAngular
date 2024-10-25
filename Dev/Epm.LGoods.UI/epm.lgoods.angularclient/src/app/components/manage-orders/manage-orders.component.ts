import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {
  
  orders: Order[] = [];
  paginatedOrders: Order[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  selectedOrder?: Order;
  isSortOptionsOpen: boolean = false;
  currentSortCriteria: string = '';
  itemsPerPageOptions: number[] = [5, 10, 20, 50];

  constructor(
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef, private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.orderService.getAllOrders().subscribe(
      (data: Order[]) => {
        this.orders = data;
        this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
        this.updatePaginatedOrders();
      },
      error => {
        console.error('Error fetching orders:', error);
        this.toastr.error('Failed to fetch orders', 'Error');
      }
    );
  }

  toggleSortOptions() {
    this.isSortOptionsOpen = !this.isSortOptionsOpen;
  }

  sortOrders(criteria: string) {
    this.currentSortCriteria = criteria;
    this.orders.sort((a, b) => {
      if (a.orderStatus === criteria && b.orderStatus !== criteria) {
        return -1;
      }
      if (a.orderStatus !== criteria && b.orderStatus === criteria) {
        return 1;
      }
      return 0;
    });
    this.updatePaginatedOrders();
    this.isSortOptionsOpen = false;
  }

  updatePaginatedOrders() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedOrders = this.orders.slice(start, end).map(order => ({ ...order, isOptionsOpen: false }));
  }

  toggleOptions(order: Order) {
    order.isOptionsOpen = !order.isOptionsOpen;
  }

  updateOrderStatus(order: Order, newStatus: string) {
    this.orderService.updateOrderStatus(order.id, newStatus).subscribe(() => {
      // Create a new order object with the updated status
      const updatedOrder = { ...order, orderStatus: newStatus, isOptionsOpen: false };

      // Update the order in the main orders array
      const index = this.orders.findIndex(o => o.id === order.id);
      if (index !== -1) {
        this.orders[index] = updatedOrder;
      }

      // Update the order in the paginatedOrders array
      const paginatedIndex = this.paginatedOrders.findIndex(o => o.id === order.id);
      if (paginatedIndex !== -1) {
        this.paginatedOrders[paginatedIndex] = updatedOrder;
      }

      if (newStatus === this.currentSortCriteria) {
        this.sortOrders(this.currentSortCriteria);
      } else {
        this.updatePaginatedOrders();
      }
      if (newStatus === 'Cancelled') {
        this.toastr.error(`Order ${order.id} has been cancelled.`, 'Order Cancelled');
      } else {
        this.toastr.success(`Order ${order.id} successfully ${newStatus.toLowerCase()}.`, 'Success');
      }

      this.cdr.detectChanges();
    },
      error => {
      console.error('Error updating order status:', error);
      this.toastr.error('Failed to update order status', 'Error');
    });
  }

  isActionDisabled(order: Order, action: string): boolean {
    switch (action) {
      case 'Complete':
        return order.orderStatus !== 'Delivered'; //false it will enable the button
      case 'Cancel':
        return order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled' || order.orderStatus === 'Shipped' || order.orderStatus === 'Completed'; //true
      case 'Ship':
        return order.orderStatus !== 'Pending'; //false
      case 'Deliver':
        return order.orderStatus !== 'Shipped'; //false
      default:
        return false;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedOrders();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedOrders();
    }
  }

  changeItemsPerPage(event: Event) {
    const target = event.target as HTMLSelectElement; //cast to HTMLSelectElement
    this.itemsPerPage = +target.value; // Convert string to number using unary operator
    this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage); //rounding to nearest value
    this.currentPage = 1; // Reset to first page to start from the beginning
    this.updatePaginatedOrders();//to refresh  the displayed orders based on the new itemsPerPage and currentPage.
  }
}
