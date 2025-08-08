import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  Table, 
  TableSection, 
  TableStatus, 
  DashboardStats, 
  SectionSummary, 
  Order, 
  CreateOrderRequest,
  ApiResponse,
  PaginatedResponse 
} from '../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class RestaurantApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Generic GET method with query parameters
  get<T>(endpoint: string, params?: Record<string, any>): Observable<T> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { 
      params: httpParams,
      withCredentials: true 
    });
  }

  // Generic POST method
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, {
      withCredentials: true
    });
  }

  // Generic PUT method
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, {
      withCredentials: true
    });
  }

  // Generic DELETE method
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
      withCredentials: true
    });
  }

  // Generic PATCH method
  patch<T>(endpoint: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body, {
      withCredentials: true
    });
  }

  private buildQueryString(params: Record<string, any>): string {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key].toString());
      }
    });

    return queryParams.toString();
  }

  // Helper method for search endpoints
  search<T>(endpoint: string, query: string, additionalParams?: Record<string, any>): Observable<T> {
    const params = { q: query, ...additionalParams };
    return this.get<T>(endpoint, params);
  }

  // =================================
  // TABLE API METHODS
  // =================================

  getTables(): Observable<ApiResponse<Table[]>> {
    return this.get<ApiResponse<Table[]>>('/tables');
  }

  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.get<ApiResponse<DashboardStats>>('/tables/dashboard/stats');
  }

  getTableSections(): Observable<ApiResponse<TableSection[]>> {
    return this.get<ApiResponse<TableSection[]>>('/tables/sections');
  }

  getSectionSummary(lang: string = 'tr'): Observable<ApiResponse<SectionSummary[]>> {
    return this.get<ApiResponse<SectionSummary[]>>('/tables/sections/summary', { lang });
  }

  getSectionTables(sectionCode: string): Observable<ApiResponse<Table[]>> {
    return this.get<ApiResponse<Table[]>>(`/tables/sections/${sectionCode}`);
  }

  getTableById(tableId: string): Observable<ApiResponse<Table>> {
    return this.get<ApiResponse<Table>>(`/tables/${tableId}`);
  }

  getTableDetails(tableId: string): Observable<ApiResponse<Table>> {
    return this.get<ApiResponse<Table>>(`/tables/${tableId}/details`);
  }

  updateTableStatus(tableId: string, status: TableStatus): Observable<ApiResponse<Table>> {
    return this.put<ApiResponse<Table>>(`/tables/${tableId}/status`, status);
  }

  updateTableReservationStatus(tableId: string, reservationData: { is_reserved: boolean; assigned_server?: string }): Observable<ApiResponse<Table>> {
    return this.put<ApiResponse<Table>>(`/tables/${tableId}/reservation`, reservationData);
  }

  getTableOrders(tableId: string): Observable<ApiResponse<Order[]>> {
    return this.get<ApiResponse<Order[]>>(`/tables/${tableId}/orders`);
  }

  createTableOrder(tableId: string, orderData: CreateOrderRequest): Observable<ApiResponse<Order>> {
    return this.post<ApiResponse<Order>>(`/tables/${tableId}/orders`, orderData);
  }

  getActiveTableOrder(tableId: string): Observable<ApiResponse<Order>> {
    return this.get<ApiResponse<Order>>(`/tables/${tableId}/orders/active`);
  }
}
