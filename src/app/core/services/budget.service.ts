import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse, BudgetDto, CreateBudgetDto, UpdateBudgetDto
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/budgets`;

  getAll(): Observable<ApiResponse<BudgetDto[]>> {
    return this.http.get<ApiResponse<BudgetDto[]>>(this.apiUrl);
  }

  getCurrent(): Observable<ApiResponse<BudgetDto>> {
    return this.http.get<ApiResponse<BudgetDto>>(`${this.apiUrl}/current`);
  }

  getById(monthYear: string): Observable<ApiResponse<BudgetDto>> {
    return this.http.get<ApiResponse<BudgetDto>>(`${this.apiUrl}/${monthYear}`);
  }

  create(dto: CreateBudgetDto): Observable<ApiResponse<BudgetDto>> {
    return this.http.post<ApiResponse<BudgetDto>>(this.apiUrl, dto);
  }

  update(monthYear: string, dto: UpdateBudgetDto): Observable<ApiResponse<BudgetDto>> {
    return this.http.put<ApiResponse<BudgetDto>>(`${this.apiUrl}/${monthYear}`, dto);
  }

  delete(monthYear: string): Observable<ApiResponse<object>> {
    return this.http.delete<ApiResponse<object>>(`${this.apiUrl}/${monthYear}`);
  }
}
