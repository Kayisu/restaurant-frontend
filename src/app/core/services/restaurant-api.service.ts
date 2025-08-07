import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurantApiService {
  private readonly baseUrl = 'http://localhost:5001/api';

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

  getTables(): Observable<any> {
    return this.get('/tables');
  }

  getDashboardStats(): Observable<any> {
    return this.get('/tables/dashboard/stats');
  }

  getTableSections(): Observable<any> {
    return this.get('/tables/sections');
  }

  getSectionSummary(lang: string = 'tr'): Observable<any> {
    return this.get('/tables/sections/summary', { lang });
  }

  getSectionTables(sectionCode: string): Observable<any> {
    return this.get(`/tables/sections/${sectionCode}`);
  }

  getTableById(tableId: string): Observable<any> {
    return this.get(`/tables/${tableId}`);
  }

  getTableDetails(tableId: string): Observable<any> {
    return this.get(`/tables/${tableId}/details`);
  }

  updateTableStatus(tableId: string, status: { is_occupied: boolean; assigned_server?: string }): Observable<any> {
    return this.put(`/tables/${tableId}/status`, status);
  }

  getTableOrders(tableId: string): Observable<any> {
    return this.get(`/tables/${tableId}/orders`);
  }

  createTableOrder(tableId: string, orderData: any): Observable<any> {
    return this.post(`/tables/${tableId}/orders`, orderData);
  }

  getActiveTableOrder(tableId: string): Observable<any> {
    return this.get(`/tables/${tableId}/orders/active`);
  }
}
