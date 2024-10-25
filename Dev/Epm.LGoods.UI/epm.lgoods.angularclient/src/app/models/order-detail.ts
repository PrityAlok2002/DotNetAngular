export interface OrderDetailsDto {
  id: number;
  customerName: string;
  orderId: number;
  totalAmount: number;
  deliveryFee: number;
  tax: number;
  discountedPrice: number; // Add this property to match the backend DTO
  orderDate: Date;
  orderStatus: string;
  paymentMethod: string;
  products: ProductDto[];
}

export interface ProductDto {
  productId: number;
  productName: string;
  shortDescription: string;
  quantity: number;
  costPrice: number;
  images: ProductImageDto[]; // Add this property to include images
}

export interface ProductImageDto {
  imageId: number;
  imageUrl: string;
  isMain: boolean;
}
