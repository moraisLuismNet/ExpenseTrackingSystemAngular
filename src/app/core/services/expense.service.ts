import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse, PagedResponse, ExpenseDto, CreateExpenseDto,
  UpdateExpenseDto, ExpenseSummaryDto, MonthlySummaryDto, ExpenseMonthDto
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/expenses`;

  getAll(params?: {
    page?: number; pageSize?: number; month?: number;
    year?: number; categoryId?: number; search?: string
  }): Observable<ApiResponse<PagedResponse<ExpenseDto>>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page);
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
      if (params.month) httpParams = httpParams.set('month', params.month);
      if (params.year) httpParams = httpParams.set('year', params.year);
      if (params.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);
      if (params.search) httpParams = httpParams.set('search', params.search);
    }
    return this.http.get<ApiResponse<PagedResponse<ExpenseDto>>>(this.apiUrl, { params: httpParams });
  }

  getById(id: string): Observable<ApiResponse<ExpenseDto>> {
    return this.http.get<ApiResponse<ExpenseDto>>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateExpenseDto): Observable<ApiResponse<ExpenseDto>> {
    return this.http.post<ApiResponse<ExpenseDto>>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateExpenseDto): Observable<ApiResponse<ExpenseDto>> {
    return this.http.put<ApiResponse<ExpenseDto>>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<ApiResponse<object>> {
    return this.http.delete<ApiResponse<object>>(`${this.apiUrl}/${id}`);
  }

  getSummary(): Observable<ApiResponse<ExpenseSummaryDto>> {
    return this.http.get<ApiResponse<ExpenseSummaryDto>>(`${this.apiUrl}/summary`);
  }

  getMonthlySummary(month: number, year: number): Observable<ApiResponse<MonthlySummaryDto>> {
    return this.http.get<ApiResponse<MonthlySummaryDto>>(`${this.apiUrl}/monthly-summary`, {
      params: { month, year }
    });
  }

  getMonths(): Observable<ApiResponse<ExpenseMonthDto[]>> {
    return this.http.get<ApiResponse<ExpenseMonthDto[]>>(`${this.apiUrl}/months`);
  }
}
