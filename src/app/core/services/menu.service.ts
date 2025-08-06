import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestaurantApiService } from './restaurant-api.service';
import { 
  Menu, 
  MenuComposition, 
  MenuStats, 
  PopularMenu, 
  MenuFilters, 
  MenuSearchResponse,
  CreateMenuRequest,
  UpdateMenuRequest
} from '../../shared/interfaces/menu.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  
  constructor(private api: RestaurantApiService) {}

  // Public endpoints (all users)
  getMenus(filters?: MenuFilters): Observable<MenuSearchResponse> {
    return this.api.get<MenuSearchResponse>('/menu/compositions', filters);
  }

  getMenu(id: number): Observable<MenuComposition> {
    return this.api.get<MenuComposition>(`/menu/compositions/${id}`);
  }

  getMenusByCategory(categoryId: number): Observable<Menu[]> {
    return this.api.get<Menu[]>(`/menu/compositions/category/${categoryId}`);
  }

  searchMenus(query: string, filters?: Omit<MenuFilters, 'search'>): Observable<MenuSearchResponse> {
    const params = { q: query, ...filters };
    return this.api.get<MenuSearchResponse>('/menu/search', params);
  }

  getMenuStats(): Observable<MenuStats> {
    return this.api.get<MenuStats>('/menu/stats');
  }

  getPopularMenus(): Observable<PopularMenu[]> {
    return this.api.get<PopularMenu[]>('/menu/popular');
  }

  // Admin-only endpoints
  createMenu(menuData: CreateMenuRequest): Observable<MenuComposition> {
    return this.api.post<MenuComposition>('/menu/compositions', menuData);
  }

  updateMenu(id: number, menuData: UpdateMenuRequest): Observable<MenuComposition> {
    return this.api.put<MenuComposition>(`/menu/compositions/${id}`, menuData);
  }

  deleteMenu(id: number): Observable<{ success: boolean; message: string }> {
    return this.api.delete<{ success: boolean; message: string }>(`/menu/compositions/${id}`);
  }

  // Helper methods for common operations
  getAvailableMenus(categoryId?: number): Observable<MenuSearchResponse> {
    const filters: MenuFilters = { 
      is_available: true,
      ...(categoryId && { category_id: categoryId })
    };
    return this.getMenus(filters);
  }

  getMenusInPriceRange(minPrice: number, maxPrice: number): Observable<MenuSearchResponse> {
    return this.getMenus({ min_price: minPrice, max_price: maxPrice });
  }

  // Utility methods for menu calculations
  calculateMenuSavings(menu: MenuComposition): number {
    const individualTotal = menu.items.reduce((total, item) => {
      return total + (item.product?.product_price || 0) * item.quantity;
    }, 0);
    
    return individualTotal - menu.menu_price;
  }

  calculateSavingsPercentage(menu: MenuComposition): number {
    const savings = this.calculateMenuSavings(menu);
    const individualTotal = menu.individual_items_total;
    
    return individualTotal > 0 ? (savings / individualTotal) * 100 : 0;
  }

  // Menu composition helpers
  getMainItems(menu: MenuComposition) {
    return menu.items.filter(item => item.item_type === 'main');
  }

  getSideItems(menu: MenuComposition) {
    return menu.items.filter(item => item.item_type === 'side');
  }

  getDrinkItems(menu: MenuComposition) {
    return menu.items.filter(item => item.item_type === 'drink');
  }

  getDessertItems(menu: MenuComposition) {
    return menu.items.filter(item => item.item_type === 'dessert');
  }

  getRequiredItems(menu: MenuComposition) {
    return menu.items.filter(item => item.is_required);
  }

  getOptionalItems(menu: MenuComposition) {
    return menu.items.filter(item => !item.is_required);
  }

  // Validation helpers
  validateMenuData(menuData: CreateMenuRequest): string[] {
    const errors: string[] = [];

    if (!menuData.menu_name || menuData.menu_name.trim().length === 0) {
      errors.push('Menu name is required');
    }

    if (menuData.menu_price <= 0) {
      errors.push('Menu price must be greater than 0');
    }

    if (!menuData.items || menuData.items.length === 0) {
      errors.push('Menu must have at least one item');
    }

    if (menuData.items) {
      const hasMainItem = menuData.items.some(item => item.item_type === 'main');
      if (!hasMainItem) {
        errors.push('Menu must have at least one main item');
      }

      menuData.items.forEach((item, index) => {
        if (item.quantity <= 0) {
          errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
        }
        if (!item.product_id) {
          errors.push(`Item ${index + 1}: Product ID is required`);
        }
      });
    }

    return errors;
  }
}
