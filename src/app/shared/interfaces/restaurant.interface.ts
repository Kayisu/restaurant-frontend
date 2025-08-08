export interface Table {
  id: string;
  table_id: string; // For backward compatibility
  table_number: string;
  section_code: string;
  capacity: number;
  is_occupied: boolean;
  is_reserved?: boolean;
  assigned_server?: string;
  table_status: string; // For backward compatibility
  server_name?: string;
  occupied_duration_minutes?: number;
  order_item_count?: number;
  total_amount?: number;
  customer_name?: string;
  customer_phone?: string;
  reservation_id?: string;
  reserved_party_size?: number;
  reservation_date?: string;
  reservation_time?: string;
  reservation_status?: string;
  reserved_customer_name?: string;
  reserved_customer_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface TableSection {
  code: string;
  name: string;
  description?: string;
  table_count: number;
}

export interface TableStatus {
  is_occupied: boolean;
  is_reserved?: boolean;
  assigned_server?: string;
  table_status?: 'available' | 'occupied' | 'reserved' | 'cleaning';
}

export interface DashboardStats {
  total_tables: number;
  occupied_tables: number;
  available_tables: number;
  reserved_tables: number;
  total_orders: number;
  active_orders: number;
  revenue_today: number;
  total_revenue: number; // For backward compatibility
}

export interface SectionSummary {
  section_code: string;
  section_name: string;
  total_tables: number;
  occupied_tables: number;
  available_tables: number;
}

export interface Order {
  id: string;
  table_id: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
}

export interface CreateOrderRequest {
  items: {
    product_id: string;
    quantity: number;
    notes?: string;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
