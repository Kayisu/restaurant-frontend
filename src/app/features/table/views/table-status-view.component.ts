import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantApiService } from '../../../core/services/restaurant-api.service';
import { ToastService } from '../../../core/services/toast.service';

interface TableInfo {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  serverName?: string;
  customerCount?: number;
  customerName?: string;
  reservationTime?: string;
  occupiedSince?: string;
  totalAmount?: number;
  orderCount?: number;
  lastOrderTime?: string;
}

@Component({
  standalone: true,
  selector: 'app-table-status-view',
  imports: [
    CommonModule // Ensure CommonModule is imported for *ngIf
  ],
  styleUrl: './styles/table-status-view.component.scss',
  template: `
    <div class="table-status-container">
      <div class="status-header">
        <h2>Table Status</h2>
        <div class="status-badge" [class]="getStatusClass()">
          {{ getStatusText() }}
        </div>
      </div>

      <div class="table-info-grid" *ngIf="tableData">
        <!-- Basic Table Info -->
        <div class="info-section">
          <h3>Table Information</h3>
          <div class="info-items">
            <div class="info-item">
              <span class="label">Table Number:</span>
              <span class="value">{{ tableData.number }}</span>
            </div>
            <div class="info-item">
              <span class="label">Capacity:</span>
              <span class="value">{{ tableData.capacity }} people</span>
            </div>
            <div class="info-item">
              <span class="label">Status:</span>
              <span class="value">{{ getStatusText() }}</span>
            </div>
          </div>
        </div>

        <!-- Empty State Message -->
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>Data Being Prepared</h3>
          <p>Table details will be available with backend integration.</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons" *ngIf="tableData">
        <button 
          class="btn btn-primary" 
          *ngIf="tableData.status === 'available'"
          (click)="seatCustomer()">
          🪑 Seat Customer
        </button>
        <button 
          class="btn btn-warning" 
          *ngIf="tableData.status === 'occupied'"
          (click)="generateBill()">
          🧾 Generate Bill
        </button>
        <button 
          class="btn btn-success" 
          *ngIf="tableData.status === 'occupied'"
          (click)="clearTable()">
          ✅ Clear Table
        </button>
        <button 
          class="btn btn-info"
          (click)="changeServer()">
          👥 Change Server
        </button>
      </div>
    </div>
  `
})
export class TableStatusViewComponent {
  @Input() tableInfo: TableInfo | null = null;

  constructor(
    private restaurantApi: RestaurantApiService,
    private toastService: ToastService
  ) {}

  get tableData(): TableInfo | null {
    return this.tableInfo;
  }

  getStatusClass(): string {
    if (!this.tableData) return 'available';
    return this.tableData.status;
  }

  getStatusText(): string {
    if (!this.tableData) return 'Available';
    
    const statusMap = {
      'available': 'Available',
      'occupied': 'Occupied',
      'reserved': 'Reserved',
      'cleaning': 'Cleaning'
    };
    
    return statusMap[this.tableData.status] || 'Unknown';
  }

  async seatCustomer(): Promise<void> {
    if (!this.tableData) return;

    try {
      const response = await this.restaurantApi.updateTableStatus(this.tableData.id, {
        is_occupied: true
      }).toPromise();

      if (response?.success) {
        this.tableData.status = 'occupied';
        this.toastService.success('Table Occupied', `Table ${this.tableData.number} is now occupied`);
      } else {
        throw new Error('Backend response failed');
      }
    } catch (error) {
      console.warn('Backend not available, updating local state only');
      this.tableData.status = 'occupied';
      this.toastService.info('Local Update', `Table ${this.tableData.number} marked as occupied (local only)`);
    }
  }

  async clearTable(): Promise<void> {
    if (!this.tableData) return;

    try {
      const response = await this.restaurantApi.updateTableStatus(this.tableData.id, {
        is_occupied: false
      }).toPromise();

      if (response?.success) {
        this.tableData.status = 'available';
        this.toastService.success('Table Cleared', `Table ${this.tableData.number} is now available`);
      } else {
        throw new Error('Backend response failed');
      }
    } catch (error) {
      console.warn('Backend not available, updating local state only');
      this.tableData.status = 'available';
      this.toastService.info('Local Update', `Table ${this.tableData.number} marked as available (local only)`);
    }
  }

  generateBill(): void {
    if (!this.tableData) return;
    this.toastService.info('Generate Bill', `Bill generation for Table ${this.tableData.number} - Coming soon!`);
  }

  changeServer(): void {
    if (!this.tableData) return;
    this.toastService.info('Change Server', `Server assignment for Table ${this.tableData.number} - Coming soon!`);
  }
}
