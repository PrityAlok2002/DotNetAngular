export interface ManufacturerDTO {
  manufacturerId?: number;
  manufacturerName: string;
  description?: string;
  discounts?: number;
  limitedToVendors?: number[]
  displayOrder: number;
  published: boolean;
  createdOn: string;
}
