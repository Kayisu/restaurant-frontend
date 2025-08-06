import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RestaurantApiService } from '../../core/services/restaurant-api.service';

interface TableData {
  table_id: string;
  capacity: number;
  is_occupied: boolean;
  table_status: string;
  server_name?: string;
  occupied_duration_minutes?: number;
  order_item_count?: number;
  total_amount?: number;
  customer_name?: string;
  customer_phone?: string;
}

interface DashboardStats {
  total_tables: number;
  available_tables: number;
  occupied_tables: number;
  reserved_tables: number;
  total_revenue: number;
  active_orders: number;
}

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  styleUrl: './dashboard.component.scss',
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>📊 Restaurant Dashboard</h1>
        <p>Welcome back, {{ authService.user()?.user_name }}!</p>
      </div>

      <div class="dashboard-stats" *ngIf="dashboardStats">
        <div class="stat-card">
          <div class="stat-icon">🍽️</div>
          <div class="stat-content">
            <h3>{{ dashboardStats.total_tables || tables.length }}</h3>
            <p>Total Tables</p>
          </div>
        </div>
        
        <div class="stat-card available">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>{{ dashboardStats.available_tables || availableTables }}</h3>
            <p>Available</p>
          </div>
        </div>
        
        <div class="stat-card occupied">
          <div class="stat-icon">❌</div>
          <div class="stat-content">
            <h3>{{ dashboardStats.occupied_tables || occupiedTables }}</h3>
            <p>Occupied</p>
          </div>
        </div>
        
        <div class="stat-card reserved">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <h3>{{ dashboardStats.reserved_tables || 0 }}</h3>
            <p>Reserved</p>
          </div>
        </div>
      </div>

      <div class="dashboard-actions">
        <button class="action-btn secondary" (click)="navigateTo('/menu')">
          <span class="btn-icon">🍽️</span>
          Manage Menus
        </button>
        
        <button class="action-btn" (click)="navigateTo('/settings')" *ngIf="isAdmin">
          <span class="btn-icon">⚙️</span>
          Settings
        </button>
      </div>

      <div class="tables-section">
        <div class="section-header">
          <h2>📍 Table Status</h2>
          <div class="section-navigation" *ngIf="tableSectionKeys.length > 1">
            <button 
              class="nav-btn" 
              (click)="previousSection()" 
              [disabled]="currentSectionIndex === 0"
            >
              ← Previous
            </button>
            <span class="section-indicator">
              Section {{ currentSection }} ({{ currentSectionIndex + 1 }}/{{ tableSectionKeys.length }})
            </span>
            <button 
              class="nav-btn" 
              (click)="nextSection()" 
              [disabled]="currentSectionIndex === tableSectionKeys.length - 1"
            >
              Next →
            </button>
          </div>
        </div>

        <div class="tables-grid" *ngIf="currentSectionTables.length > 0">
          <div 
            class="table-card" 
            *ngFor="let table of currentSectionTables"
            [class.available]="!table.is_occupied"
            [class.occupied]="table.is_occupied"
            (click)="selectTable(table)"
          >
            <div class="table-header">
              <h3>{{ table.table_id }}</h3>
              <span class="table-status">{{ getStatusText(table) }}</span>
            </div>
            <div class="table-details">
              <p>👥 Capacity: {{ table.capacity }}</p>
              <p *ngIf="table.server_name">� Server: {{ table.server_name }}</p>
              <p *ngIf="table.occupied_duration_minutes">
                🕐 {{ table.occupied_duration_minutes }} mins
              </p>
              <p *ngIf="table.customer_name">
                🙋 {{ table.customer_name }}
              </p>
              <p *ngIf="table.total_amount">
                � ₺{{ table.total_amount }}
              </p>
            </div>
          </div>
        </div>

        <div class="loading" *ngIf="loading">
          Loading tables...
        </div>

        <div class="no-tables" *ngIf="!loading && tables.length === 0">
          No tables found
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  tables: TableData[] = [];
  dashboardStats: DashboardStats | null = null;
  loading = true;
  
  // Table section management
  tableSections: { [key: string]: TableData[] } = {};
  tableSectionKeys: string[] = [];
  currentSectionIndex = 0;
  currentSection = '';

  constructor(
    private router: Router,
    public authService: AuthService,
    private restaurantApi: RestaurantApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;

    // Load tables and stats in parallel
    Promise.all([
      this.loadTables(),
      this.loadDashboardStats()
    ]).finally(() => {
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  async loadTables() {
    try {
      const response = await this.restaurantApi.getTables().toPromise();
      if (response?.success && response?.data) {
        this.tables = response.data;
        this.groupTablesBySection();
        this.cdr.detectChanges();
      } else {
        await this.loadSampleTablesWithDelay();
      }
    } catch (error) {
      await this.loadSampleTablesWithDelay();
    }
  }

  async loadSampleTablesWithDelay() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.loadSampleTables();
    this.cdr.detectChanges();
  }

  async loadDashboardStats() {
    try {
      const response = await this.restaurantApi.getDashboardStats().toPromise();
      if (response?.success && response?.data) {
        this.dashboardStats = response.data;
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  }

  loadSampleTables() {
    this.tables = [
      { table_id: 'A-01', capacity: 4, is_occupied: false, table_status: 'available' },
      { table_id: 'A-02', capacity: 4, is_occupied: true, table_status: 'occupied', server_name: 'John', customer_name: 'Smith Family', occupied_duration_minutes: 45, total_amount: 150 },
      { table_id: 'A-03', capacity: 2, is_occupied: false, table_status: 'available' },
      { table_id: 'B-01', capacity: 6, is_occupied: true, table_status: 'occupied', server_name: 'Alice', customer_name: 'Johnson Group', occupied_duration_minutes: 30, total_amount: 250 },
      { table_id: 'B-02', capacity: 4, is_occupied: false, table_status: 'available' },
      { table_id: 'C-01', capacity: 8, is_occupied: false, table_status: 'available' },
      { table_id: 'VIP-01', capacity: 10, is_occupied: true, table_status: 'occupied', server_name: 'Michael', customer_name: 'Corporate Event', occupied_duration_minutes: 120, total_amount: 800 },
    ];
    this.groupTablesBySection();
  }

  groupTablesBySection() {
    this.tableSections = {};
    
    this.tables.forEach(table => {
      const sectionKey = this.getSectionKey(table.table_id);
      
      if (!this.tableSections[sectionKey]) {
        this.tableSections[sectionKey] = [];
      }
      this.tableSections[sectionKey].push(table);
    });

    this.tableSectionKeys = Object.keys(this.tableSections).sort();
    
    if (this.tableSectionKeys.length > 0) {
      this.currentSection = this.tableSectionKeys[0];
      this.currentSectionIndex = 0;
    }
  }

  getSectionKey(tableId: string): string {
    const match = tableId.match(/^([A-Z]+)/);
    return match ? match[1] : 'OTHER';
  }

  get currentSectionTables(): TableData[] {
    return this.tableSections[this.currentSection] || [];
  }

  previousSection() {
    if (this.currentSectionIndex > 0) {
      this.currentSectionIndex--;
      this.currentSection = this.tableSectionKeys[this.currentSectionIndex];
    }
  }

  nextSection() {
    if (this.currentSectionIndex < this.tableSectionKeys.length - 1) {
      this.currentSectionIndex++;
      this.currentSection = this.tableSectionKeys[this.currentSectionIndex];
    }
  }

  get isAdmin(): boolean {
    return this.authService.user()?.role_id === 1;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  get availableTables(): number {
    return this.tables.filter(table => !table.is_occupied).length;
  }

  get occupiedTables(): number {
    return this.tables.filter(table => table.is_occupied).length;
  }

  getStatusText(table: TableData): string {
    return table.is_occupied ? 'Occupied' : 'Available';
  }

  selectTable(table: TableData): void {
    this.router.navigate(['/table', table.table_id]);
  }
}
