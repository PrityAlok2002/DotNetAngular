import { Order } from './order';

describe('Order', () => {
  it('should create an order object', () => {
    const orderInstance: Order = {
      id: 1,
      customerName: 'John Doe',
      customerPhone: '1234567890',
      orderDate: new Date(),
      orderStatus: 'Pending',
      totalAmount: 100.0,
      isOptionsOpen: false,
      paymentMethod: 'Credit Card',
      dateShipped: new Date(),
      dateDelivered: new Date(),
      houseNo: '10th',
      building: 'satva',
      landmark: 'hyderabad',
      addressLabel: 'home'
    };
    expect(orderInstance).toBeTruthy();
  });
});
