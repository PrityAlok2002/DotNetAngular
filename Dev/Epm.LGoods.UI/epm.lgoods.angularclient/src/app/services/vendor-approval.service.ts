// src/app/services/vendor-approval.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VendorApproval } from '../models/vendor-approval';

@Injectable({
  providedIn: 'root'
})
export class VendorApprovalService {
  private apiUrl = 'http://localhost:5002/api/AdminVendorApproval';

  constructor(private http: HttpClient) { }

  getPendingVendors(): Observable<VendorApproval[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending`).pipe(
      map(vendors => vendors.map(v => new VendorApproval(
        v.vendorId,
        v.vendorName,
        v.vendorEmail,
        v.businessName,
        new Date(v.registrationDate),
        v.status
      )))
    );
  }

  approveVendor(vendorId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${vendorId}/approve`, {});
  }

  rejectVendor(vendorId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${vendorId}/reject`, {});
  }
}
