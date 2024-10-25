import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { VendorApprovalComponent } from './components/vendor-approval/vendor-approval.component';
import { ProductSidebarComponent } from './components/product-sidebar/product-sidebar.component';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HeaderComponent, 
        VendorApprovalComponent,
        FooterComponent,
        ProductSidebarComponent
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    }).compileComponents();
  });

   it('should create the app', () => {
     expect(AppComponent).toBeTruthy();
   });

  

