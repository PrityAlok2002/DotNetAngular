export interface Inventory {
  inventoryId: number;
  productId: number;
  minimumCartQuantity: number;
  maximumCartQuantity: number;
  quantityStep: number;
}
