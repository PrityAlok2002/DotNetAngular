import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCreationComponent } from './components/product-creation/product-creation.component';
import { PriceComponent } from './components/price/price.component';
import { VendorApprovalComponent } from './components/vendor-approval/vendor-approval.component';
import { CategoryCreationComponent } from './components/category-creation/category-creation.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ProductSidebarComponent } from './components/product-sidebar/product-sidebar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductFilterComponent } from './components/product-filter/product-filter.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductImageComponent } from './components/product-image/product-image.component';
import { ManageOrdersComponent } from './components/manage-orders/manage-orders.component';
import { ShipmentComponent } from './components/shipment/shipment.component';
import { CategoryMappingComponent } from './components/category-mapping/category-mapping.component';
import { ProductLayoutComponent } from './components/product-layout/product-layout.component';
import { ManufacturerDetailsComponent } from './components/manufacturer-details/manufacturer-details.component';
import { ManufacturerListComponent } from './components/manufacturer-list/manufacturer-list.component';
import { ProductTagsComponent } from './components/product-tags/product-tags.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { StockLevelComponent } from './components/stock-level/stock-level.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { TagSelectorComponent } from './components/tag-selector/tag-selector.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { DashboardStatisticsComponent } from './components/dashboard-statistics/dashboard-statistics.component';
import { DashboardLatestOrdersComponent } from './components/dashboard-latest-orders/dashboard-latest-orders.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'product-layout', component: ProductLayoutComponent, children: [
      { path: 'pictures', component: ProductImageComponent },
      { path: 'product', component: ProductListComponent },
      { path: 'price', component: PriceComponent },
      { path: 'category-mapping', component: CategoryMappingComponent },
      { path: '', redirectTo: 'pictures', pathMatch: 'full' },
      { path: 'manufacturer-list', component: ManufacturerListComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: '', redirectTo: '/product-layout/inventory', pathMatch: 'full' },
      { path: 'product-tag', component: TagSelectorComponent }
    ]
  },
  {
    path: 'product-layout/:id', component: ProductLayoutComponent, children: [
      { path: 'pictures', component: ProductImageComponent },
      { path: 'product', component: ProductListComponent },
      { path: 'price', component: PriceComponent },
      { path: 'category-mapping', component: CategoryMappingComponent },
      { path: '', redirectTo: 'pictures', pathMatch: 'full' },
      { path: 'manufacturer-list', component: ManufacturerListComponent },
      { path: 'product-tag', component: TagSelectorComponent }
    ]
  },
  { path: 'product-tags', component: ProductTagsComponent },
  { path: 'manage-orders', component: ManageOrdersComponent },
  { path: 'shipments', component: ShipmentComponent },
  { path: 'category-mapping', component: CategoryMappingComponent },
  { path: 'register', component: RegistrationComponent },
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'vendor-approval', component: VendorApprovalComponent },
  { path: 'category-creation', component: CategoryCreationComponent },
  { path: 'category-update/:id', component: CategoryCreationComponent },
  { path: 'price', component: PriceComponent },
  { path: 'manufacturer', component: ManufacturerDetailsComponent },
  { path: 'manufacturer-list', component: ManufacturerListComponent },
  { path: 'sidebar', component: ProductSidebarComponent },
  { path: 'manufacturer-details', component: ManufacturerDetailsComponent },
  { path: 'product', component: ProductCreationComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'product-creation', component: ProductCreationComponent },
  { path: 'product-filter', component: ProductFilterComponent },
  { path: 'product-list', component: ProductListComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'uploadImage', component: ProductImageComponent },
  { path: 'product-stock', component: StockLevelComponent },
  { path: 'category-list', component: CategoryListComponent },
  {path:'product-update/:id',component: ProductCreationComponent},
  { path: 'category-list', component: CategoryListComponent },
  //{ path: 'order/:id', component: OrderDetailsComponent },
  //{ path: '', redirectTo: '/order/1', pathMatch: 'full' }, 
  //{ path: '**', redirectTo: '/order/1' },

  { path: 'product-update/:id', component: ProductCreationComponent },
  { path: 'dashboard', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
