import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../Environments/environments';
import { OrderDetailsDto } from '../models/order-detail';
import { Order } from '../models/order';
import { LatestOrderDto } from '../models/LatestOrderDto';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private statisticsUrl = environment.apiStatistics;
  private latestOrdersUrl = environment.apiLatestOrder;

  constructor(private http: HttpClient) { }

  getStatistics(): Observable<any> {
    return this.http.get<any>(this.statisticsUrl);
  }

  getLatestOrders(): Observable<LatestOrderDto[]> {
    return this.http.get<LatestOrderDto[]>(this.latestOrdersUrl);
  }
}
