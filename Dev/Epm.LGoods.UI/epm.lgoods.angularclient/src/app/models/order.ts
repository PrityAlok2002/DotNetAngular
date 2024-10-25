export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  orderDate: Date |string;
  orderStatus: string;
  totalAmount: number;
  isOptionsOpen: boolean;
  paymentMethod: string;
  dateShipped: Date | string;
  dateDelivered: Date | string;
  houseNo: string;
  building: string;
  landmark: string;
  addressLabel: string;
}
