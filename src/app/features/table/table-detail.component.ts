import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantApiService } from '../../core/services/restaurant-api.service';
import { TableStatusViewComponent } from './views/table-status-view.component';
import { TableOrdersViewComponent } from './views/table-orders-view.component';
import { AddOrderViewComponent } from './views/add-order-view.component';

@Component({
  standalone: true,
  selector: 'app-table-detail',
  imports: [
    CommonModule,
    TableStatusViewComponent,
    TableOrdersViewComponent,
    AddOrderViewComponent
  ],
  styleUrl: './table-detail.component.scss',
  template: `
    <div class="table-detail-container">
      <div class="table-detail-header">
        <button class="back-btn" (click)="goBack()">
          <span class="back-icon">←</span>
          <span>Back to Tables</span>
        </button>
        <h1>Table {{ tableId }}</h1>
      </div>

      <div class="table-tabs">
        <button 
          class="tab-btn"
          [class.active]="activeTab === 'status'"
          (click)="setActiveTab('status')">
          📊 Table Status
        </button>
        <button 
          class="tab-btn"
          [class.active]="activeTab === 'orders'"
          (click)="setActiveTab('orders')">
          📋 Orders
        </button>
        <button 
          class="tab-btn"
          [class.active]="activeTab === 'add-order'"
          (click)="setActiveTab('add-order')">
          ➕ Add Order
        </button>
      </div>

      <div class="table-content">
        <!-- Loading State -->
        <div class="loading-state" *ngIf="loading">
          <div class="loading-spinner">⏳</div>
          <p>Loading table information...</p>
        </div>

        <!-- Content -->
        <div *ngIf="!loading">
          <app-table-status-view 
            *ngIf="activeTab === 'status'" 
            [tableInfo]="tableInfo">
          </app-table-status-view>
          
          <app-table-orders-view 
            *ngIf="activeTab === 'orders'" 
            [tableId]="tableId">
          </app-table-orders-view>
          
          <app-add-order-view 
            *ngIf="activeTab === 'add-order'" 
            [tableId]="tableId">
          </app-add-order-view>
        </div>
      </div>
    </div>
  `
})
export class TableDetailComponent implements OnInit {
  tableId: string = '';
  activeTab: 'status' | 'orders' | 'add-order' = 'status';
  loading = true;
  tableInfo: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restaurantApi: RestaurantApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.tableId = params['tableId'];
      this.loadTableData();
    });
  }

  async loadTableData() {
    this.loading = true;
    
    // Önce router state'den veri almaya çalış
    const navigation = this.router.getCurrentNavigation();
    const routerState = navigation?.extras?.state || history.state;
    
    if (routerState?.tableData) {
      console.log('Using router state data for table:', this.tableId);
      this.tableInfo = this.mapBackendDataToTableInfo(routerState.tableData);
      this.loading = false;
      return;
    }

    try {
      // Router state yoksa backend'den çekmeyi dene
      const response = await this.restaurantApi.getTableDetails(this.tableId).toPromise();
      if (response?.success && response?.data) {
        this.tableInfo = this.mapBackendDataToTableInfo(response.data);
      } else {
        throw new Error('Backend response invalid');
      }
    } catch (error) {
      console.warn('Backend not available, using sample data for table:', this.tableId);
      
      // Backend yoksa sample data kullan
      this.loadSampleTableData();
    } finally {
      this.loading = false;
    }
  }

  loadSampleTableData() {
    // Dashboard'daki sample data ile eşleşen veri
    const sampleTables = [
      { table_id: 'A-01', capacity: 4, is_occupied: false, table_status: 'available' },
      { table_id: 'A-02', capacity: 4, is_occupied: true, table_status: 'occupied', server_name: 'John', customer_name: 'Smith Family', occupied_duration_minutes: 45, total_amount: 150 },
      { table_id: 'A-03', capacity: 2, is_occupied: false, table_status: 'available' },
      { table_id: 'B-01', capacity: 6, is_occupied: true, table_status: 'occupied', server_name: 'Alice', customer_name: 'Johnson Group', occupied_duration_minutes: 30, total_amount: 250 },
      { table_id: 'B-02', capacity: 4, is_occupied: false, table_status: 'available' },
      { table_id: 'C-01', capacity: 8, is_occupied: false, table_status: 'available' },
      { table_id: 'VIP-01', capacity: 10, is_occupied: true, table_status: 'occupied', server_name: 'Michael', customer_name: 'Corporate Event', occupied_duration_minutes: 120, total_amount: 800 },
    ];

    const tableData = sampleTables.find(t => t.table_id === this.tableId);
    
    if (tableData) {
      this.tableInfo = this.mapBackendDataToTableInfo(tableData);
    } else {
      this.createMinimalTableInfo();
    }
  }

  mapBackendDataToTableInfo(backendData: any) {
    return {
      id: backendData.table_id || this.tableId,
      number: parseInt(backendData.table_id.replace(/[^0-9]/g, '')) || parseInt(this.tableId),
      capacity: backendData.capacity || 4,
      status: this.mapBackendStatus(backendData.is_occupied, backendData.is_reserved || false, backendData.table_status),
      serverName: backendData.server_name,
      customerCount: backendData.customer_count,
      customerName: backendData.customer_name,
      reservationTime: backendData.reservation_time,
      occupiedSince: backendData.occupied_since,
      totalAmount: backendData.total_amount,
      orderCount: backendData.order_item_count,
      lastOrderTime: backendData.last_order_time
    };
  }

  mapBackendStatus(isOccupied: boolean, isReserved: boolean, tableStatus: string): 'available' | 'occupied' | 'reserved' | 'cleaning' {
    if (isReserved) return 'reserved';
    if (tableStatus === 'cleaning') return 'cleaning';
    return isOccupied ? 'occupied' : 'available';
  }

  createMinimalTableInfo() {
    this.tableInfo = {
      id: this.tableId,
      number: parseInt(this.tableId.replace(/[^0-9]/g, '')) || parseInt(this.tableId),
      capacity: 4,
      status: 'available' as const
    };
  }

  setActiveTab(tab: 'status' | 'orders' | 'add-order') {
    this.activeTab = tab;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
