import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { DatePipe } from '@angular/common'; 
import { DashboardLatestOrdersComponent } from './dashboard-latest-orders.component';
import { DashboardService } from '../../services/dashboard.service';
import { LatestOrderDto } from '../../models/LatestOrderDto';

describe('DashboardLatestOrdersComponent', () => {
  let component: DashboardLatestOrdersComponent;
  let fixture: ComponentFixture<DashboardLatestOrdersComponent>;
  let dashboardService: DashboardService;
  let httpTestingController: HttpTestingController;
  let datePipe: DatePipe; // Define datePipe

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardLatestOrdersComponent],
      imports: [HttpClientTestingModule],
      providers: [DashboardService, DatePipe] 
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLatestOrdersComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardService);
    httpTestingController = TestBed.inject(HttpTestingController);
    datePipe = TestBed.inject(DatePipe); // Instantiate DatePipe
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load latest orders on initialization', () => {
    const mockOrders: LatestOrderDto[] = [
      {
        customerId: '1',
        paymentMethod: 'Credit Card',
        totalAmount: 100,
        orderDate: new Date('2024-08-12T17:59:00Z'),
        orderStatus: 'Pending'
      }
    ];

    spyOn(dashboardService, 'getLatestOrders').and.returnValue(of(mockOrders));

    component.ngOnInit();

    expect(dashboardService.getLatestOrders).toHaveBeenCalled();
    expect(component.latestOrders).toEqual(mockOrders);
  });

  //it('should handle errors during loading of orders', () => {
  //  spyOn(dashboardService, 'getLatestOrders').and.returnValue(throwError('Error'));

  //  component.ngOnInit();

  //  expect(dashboardService.getLatestOrders).toHaveBeenCalled();
  //  expect(component.latestOrders).toEqual([]);
  //});

  it('should render latest orders in the table', () => {
    const mockOrders: LatestOrderDto[] = [
      {
        customerId: '1',
        paymentMethod: 'Credit Card',
        totalAmount: 100,
        orderDate: new Date('2024-08-12T17:59:00Z'),
        orderStatus: 'Pending'
      }
    ];

    spyOn(dashboardService, 'getLatestOrders').and.returnValue(of(mockOrders));

    component.ngOnInit();
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(mockOrders.length);

    const firstRow = rows[0];
    expect(firstRow.cells[0].textContent).toContain(mockOrders[0].customerId);
    expect(firstRow.cells[1].textContent).toContain(mockOrders[0].paymentMethod);
    expect(firstRow.cells[2].textContent).toContain(mockOrders[0].totalAmount.toFixed(2));

    const formattedDate = datePipe.transform(new Date(mockOrders[0].orderDate), 'short');
    expect(firstRow.cells[3].textContent).toBe(formattedDate);
    expect(firstRow.cells[4].textContent).toContain(mockOrders[0].orderStatus);
  });
});
