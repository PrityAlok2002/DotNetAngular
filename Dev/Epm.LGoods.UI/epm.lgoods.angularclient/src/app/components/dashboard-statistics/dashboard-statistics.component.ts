import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-statistics',
  templateUrl: './dashboard-statistics.component.html',
  styleUrl: './dashboard-statistics.component.css'
})
export class DashboardStatisticsComponent implements OnInit {
  statistics: any = {
    totalProducts: 0,
    totalCategories: 0,
    totalTags: 0,
    totalImages: 0
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.dashboardService.getStatistics().subscribe(
      data => this.statistics = data,
    );
  }

  getScoreColor(score: number): string {
    if (score > 50) return '#6AB04A'; 
    if (score > 20) return '#F39C12'; 
    if (score > 10) return '#5858ee'; 
    return '#E74C3C'; 
  }
}
