import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExportService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/export`;

  downloadCsv(month?: number, year?: number, categoryId?: number): Observable<Blob> {
    let params = new HttpParams();
    if (month) params = params.set('month', month);
    if (year) params = params.set('year', year);
    if (categoryId) params = params.set('categoryId', categoryId);
    return this.http.get(`${this.apiUrl}/csv`, { params, responseType: 'blob' });
  }

  downloadPdf(month?: number, year?: number, categoryId?: number): Observable<Blob> {
    let params = new HttpParams();
    if (month) params = params.set('month', month);
    if (year) params = params.set('year', year);
    if (categoryId) params = params.set('categoryId', categoryId);
    return this.http.get(`${this.apiUrl}/pdf`, { params, responseType: 'blob' });
  }
}
