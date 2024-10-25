import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardStatisticsComponent } from './dashboard-statistics.component';
import { DashboardService } from '../../services/dashboard.service';
import { of, throwError } from 'rxjs';

describe('DashboardStatisticsComponent', () => {
  let component: DashboardStatisticsComponent;
  let fixture: ComponentFixture<DashboardStatisticsComponent>;
  let dashboardService: DashboardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardStatisticsComponent],
      imports: [HttpClientTestingModule],
      providers: [DashboardService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardStatisticsComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load statistics on initialization', () => {
    const mockStatistics = {
      totalProducts: 120,
      totalCategories: 30,
      totalTags: 15,
      totalImages: 5
    };

    spyOn(dashboardService, 'getStatistics').and.returnValue(of(mockStatistics));

    component.ngOnInit();
    fixture.detectChanges();

    expect(dashboardService.getStatistics).toHaveBeenCalled();
    expect(component.statistics).toEqual(mockStatistics);
  });

  //it('should handle errors during loading of statistics', () => {
  //  spyOn(dashboardService, 'getStatistics').and.returnValue(throwError('Error'));

  //  component.ngOnInit();
  //  fixture.detectChanges();

  //  expect(dashboardService.getStatistics).toHaveBeenCalled();
  //  expect(component.statistics).toEqual({
  //    totalProducts: 0,
  //    totalCategories: 0,
  //    totalTags: 0,
  //    totalImages: 0
  //  });
  //});

  it('should render statistics correctly in the UI', () => {
    const mockStatistics = {
      totalProducts: 120,
      totalCategories: 30,
      totalTags: 15,
      totalImages: 5
    };

    spyOn(dashboardService, 'getStatistics').and.returnValue(of(mockStatistics));

    component.ngOnInit();
    fixture.detectChanges();

    const statItems = fixture.nativeElement.querySelectorAll('.stat-item');
    expect(statItems.length).toBe(4);

    expect(statItems[0].querySelector('.score-circle').textContent).toContain(mockStatistics.totalProducts.toString());
    expect(statItems[1].querySelector('.score-circle').textContent).toContain(mockStatistics.totalCategories.toString());
    expect(statItems[2].querySelector('.score-circle').textContent).toContain(mockStatistics.totalTags.toString());
    expect(statItems[3].querySelector('.score-circle').textContent).toContain(mockStatistics.totalImages.toString());
  });

  it('should set correct border color based on score', () => {
    expect(component.getScoreColor(120)).toBe('#6AB04A'); 
    expect(component.getScoreColor(30)).toBe('#F39C12'); 
    expect(component.getScoreColor(15)).toBe('#5858ee'); 
    expect(component.getScoreColor(5)).toBe('#E74C3C'); 
  });
});
