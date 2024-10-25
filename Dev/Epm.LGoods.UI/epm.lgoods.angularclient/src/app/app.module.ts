import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductCategoryService } from './services/product-category.service';
import { CommonModule } from '@angular/common';
import { VendorApprovalComponent } from './components/vendor-approval/vendor-approval.component';
import { PriceComponent } from './components/price/price.component';
import { PriceService } from './services/price.service';
import { CategoryCreationComponent } from './components/category-creation/category-creation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RegistrationComponent } from './components/registration/registration.component'; // Ensure this is imported
import { RegistrationService } from './services/register.service';
import { ProductCreationComponent } from './components/product-creation/product-creation.component';
import { ProductSidebarComponent } from './components/product-sidebar/product-sidebar.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFilterComponent } from './components/product-filter/product-filter.component';
import { ProductImageComponent } from './components/product-image/product-image.component';
import { ImageSelectorComponent } from './components/image-selector/image-selector.component';
import { CategoryMappingComponent } from './components/category-mapping/category-mapping.component';
import { ManageOrdersComponent } from './components/manage-orders/manage-orders.component';
import { ShipmentComponent } from './components/shipment/shipment.component';
import { ToastrModule } from 'ngx-toastr';
import { ProductLayoutComponent } from './components/product-layout/product-layout.component';
import { ManufacturerDetailsService } from './services/manufacturer-details.service';
import { ManufacturerDetailsComponent } from './components/manufacturer-details/manufacturer-details.component';
import { ProductTagsComponent } from './components/product-tags/product-tags.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Updated import for animations
import { ManufacturerListComponent } from './components/manufacturer-list/manufacturer-list.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { StockLevelComponent } from './components/stock-level/stock-level.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { TagSelectorComponent } from './components/tag-selector/tag-selector.component';
import { ProductService } from './services/product.service';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { DashboardLatestOrdersComponent } from './components/dashboard-latest-orders/dashboard-latest-orders.component';
import { DashboardStatisticsComponent } from './components/dashboard-statistics/dashboard-statistics.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    VendorApprovalComponent,
    CategoryCreationComponent,
    RegistrationComponent,
    ProductCreationComponent,
    ProductListComponent,
    ProductSidebarComponent,
    ProductFilterComponent,
    PriceComponent,
    ProductImageComponent,
    ImageSelectorComponent,
    CategoryMappingComponent,
    ProductCreationComponent,
    ManageOrdersComponent,
    ShipmentComponent,
    ProductLayoutComponent,
    ManufacturerListComponent,
    ManufacturerDetailsComponent,
    ProductCreationComponent,
    ProductTagsComponent,
    InventoryComponent,
    StockLevelComponent,
    CategoryListComponent,
    TagSelectorComponent,
    OrderDetailsComponent,
    DashboardLatestOrdersComponent,
    DashboardStatisticsComponent,
    DashboardComponent
   

  ],
  imports: [
    BrowserModule,
    
    HttpClientModule,
    AppRoutingModule, 
    //RouterModule.forRoot(routes),
    AppRoutingModule, ReactiveFormsModule, MatSlideToggleModule, CommonModule,
    FormsModule, CommonModule, MatSnackBarModule, ToastrModule.forRoot(),
    MatSlideToggleModule, MatSnackBarModule, 
    BrowserAnimationsModule
      ],
  
  providers: [
    ProductCategoryService,
    HeaderComponent,
    FooterComponent,
    VendorApprovalComponent,
    CategoryCreationComponent,
    RegistrationComponent,


    PriceComponent,

    AppRoutingModule,
    ReactiveFormsModule,
    ProductCreationComponent,
    ProductSidebarComponent,
  
    provideAnimationsAsync(),
    ProductService,
    ManufacturerDetailsService,
    ProductTagsComponent,
    

    ProductListComponent,
    ProductFilterComponent,
    ManufacturerDetailsService

  ],

  bootstrap: [AppComponent]
})
export class AppModule { }



