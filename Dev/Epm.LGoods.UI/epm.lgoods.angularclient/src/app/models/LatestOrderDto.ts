export interface LatestOrderDto {
  customerId: string;
  paymentMethod: string;
  totalAmount: number;
  orderDate: Date | string;
  orderStatus: string;
}
