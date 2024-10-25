import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Manufacturer } from '../models/manufacturer-list';
import { environment } from '../../Environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {
  private apiUrl = environment.apiUrlManufacturer;

  constructor(private http: HttpClient) { }

  getManufacturers(filter?: any): Observable<Manufacturer[]> {
    let params = new HttpParams();
    if (filter) {
      if (filter.manufacturerName) {
        params = params.append('manufacturerName', filter.manufacturerName);
      }
      if (filter.vendor) {
        params = params.append('vendor', filter.vendor);
      }
    }
    return this.http.get<Manufacturer[]>(this.apiUrl, { params });
  }
}

