// Menu Domain Interfaces

export interface Menu {
  menu_id: number;
  menu_name: string;
  menu_description?: string;
  menu_price: number;
  item_count: number;
  savings_amount: number;
  individual_items_total: number;
  is_available: boolean;
  category_id?: number;
  image_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface MenuItem {
  menu_item_id: number;
  menu_id: number;
  product_id: number;
  quantity: number;
  is_required: boolean;
  item_type: 'main' | 'side' | 'drink' | 'dessert';
  display_order: number;
  created_at: string;
  // Populated product data
  product?: {
    product_id: number;
    product_name: string;
    product_price: number;
    product_code: string;
    image_url?: string;
  };
}

export interface MenuComposition extends Menu {
  items: MenuItem[];
}

export interface MenuStats {
  total_menus: number;
  available_menus: number;
  unavailable_menus: number;
  average_menu_price: number;
  average_savings: number;
  most_popular_category: string;
  total_menu_items: number;
  last_updated: string;
}

export interface PopularMenu extends Menu {
  order_count: number;
  popularity_score: number;
  rank: number;
}

// API Request/Response types
export interface MenuFilters {
  category_id?: number;
  is_available?: boolean;
  min_price?: number;
  max_price?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface MenuSearchResponse {
  menus: Menu[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// Create/Update DTOs
export interface CreateMenuRequest {
  menu_name: string;
  menu_description?: string;
  menu_price: number;
  category_id?: number;
  is_available?: boolean;
  items: CreateMenuItemRequest[];
}

export interface CreateMenuItemRequest {
  product_id: number;
  quantity: number;
  is_required: boolean;
  item_type: 'main' | 'side' | 'drink' | 'dessert';
  display_order: number;
}

export interface UpdateMenuRequest extends Partial<CreateMenuRequest> {
  menu_id: number;
}
