import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';
import { environment } from '../../Environments/environments';
import { LatestOrderDto } from '../models/LatestOrderDto';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService]
    });

    service = TestBed.inject(DashboardService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getStatistics', () => {
    it('should return statistics data from the API', () => {
      const mockStatistics = {
        totalProducts: 100,
        totalCategories: 20,
        totalTags: 10,
        totalImages: 50
      };

      service.getStatistics().subscribe(data => {
        expect(data).toEqual(mockStatistics);
      });

      const req = httpTestingController.expectOne(environment.apiStatistics);
      expect(req.request.method).toBe('GET');
      req.flush(mockStatistics);
    });

    it('should handle error when fetching statistics', () => {
      const errorMessage = 'Failed to load statistics';

      service.getStatistics().subscribe(
        () => fail('expected an error, not statistics'),
        (error) => {
          expect(error.message).toContain('500 Server Error');
        }
      );

      const req = httpTestingController.expectOne(environment.apiStatistics);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getLatestOrders', () => {
    it('should return latest orders data from the API', () => {
      const mockOrders: LatestOrderDto[] = [
        {
          customerId: '123',
          paymentMethod: 'Credit Card',
          totalAmount: 100.50,
          orderDate: new Date(),
          orderStatus: 'Completed'
        }
      ];

      service.getLatestOrders().subscribe(data => {
        expect(data).toEqual(mockOrders);
      });

      const req = httpTestingController.expectOne(environment.apiLatestOrder);
      expect(req.request.method).toBe('GET');
      req.flush(mockOrders);
    });

    it('should handle error when fetching latest orders', () => {
      const errorMessage = 'Failed to load latest orders';

      service.getLatestOrders().subscribe(
        () => fail('expected an error, not orders'),
        (error) => {
          expect(error.message).toContain('500 Server Error');
        }
      );

      const req = httpTestingController.expectOne(environment.apiLatestOrder);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });
});
