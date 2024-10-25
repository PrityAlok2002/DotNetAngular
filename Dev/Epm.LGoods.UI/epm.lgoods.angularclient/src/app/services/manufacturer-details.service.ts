
// manufacturer-details.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ManufacturerDTO } from '../models/ManufacturerDTO';
import { VendorApproval } from '../models/vendor-approval';
import { environment } from '../../Environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerDetailsService {
  private apiUrl = 'http://localhost:5246/api/manufacturer';  // Ensure this URL is correct

  constructor(private http: HttpClient) { }

  getVendors(): Observable<VendorApproval[]> {
    return this.http.get<VendorApproval[]>(`${this.apiUrl}/vendors`);
  }

  create(manufacturer: ManufacturerDTO): Observable<any> {
    return this.http.post(this.apiUrl, manufacturer);
  }

  update(id: number, manufacturer: ManufacturerDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, manufacturer);
  }
}

