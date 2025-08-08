import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantApiService } from '../../../core/services/restaurant-api.service';
import { ToastService } from '../../../core/services/toast.service';
// import { firstValueFrom } from 'rxjs'; // istersen toPromise yerine bunu kullan

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
  imports: [CommonModule],
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

        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>Data Being Prepared</h3>
          <p>Table details will be available with backend integration.</p>
        </div>
      </div>

      <div class="action-buttons" *ngIf="tableData">
        <button 
          class="btn btn-primary" 
          *ngIf="tableData.status === 'available'"
          (click)="seatCustomer()">
          🪑 Seat Customer
        </button>
        <button 
          class="btn btn-secondary" 
          *ngIf="tableData.status === 'available'"
          (click)="reserveTable()">
          📅 Reserve Table
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
          class="btn btn-danger" 
          *ngIf="tableData.status === 'reserved'"
          (click)="cancelReservation()">
          ❌ Cancel Reservation
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
  // DIKKAT: Artık dışarıdan geleni doğrudan kullanmıyoruz.
  private _table = signal<TableInfo | null>(null);

  @Input() set tableInfo(value: TableInfo | null) {
    // referansı mutasyona uğratmamak için shallow copy
    this._table.set(value ? { ...value } : null);
  }

  get tableData(): TableInfo | null {
    return this._table();
  }

  constructor(
    private restaurantApi: RestaurantApiService,
    private toastService: ToastService
  ) {}

  getStatusClass(): string {
    const t = this._table();
    return t?.status ?? 'available';
  }

  getStatusText(): string {
    const t = this._table();
    if (!t) return 'Available';
    const map = {
      available: 'Available',
      occupied: 'Occupied',
      reserved: 'Reserved',
      cleaning: 'Cleaning'
    } as const;
    return map[t.status] ?? 'Unknown';
  }

  async seatCustomer(): Promise<void> {
    const t = this._table();
    if (!t) return;
    try {
      // const response = await firstValueFrom(this.restaurantApi.updateTableStatus(t.id, { is_occupied: true }));
      const response = await this.restaurantApi.updateTableStatus(t.id, { is_occupied: true }).toPromise();
      if (response?.success) {
        this._table.update(x => x ? { ...x, status: 'occupied' } : x);
        this.toastService.success('Table Occupied', `Table ${t.number} is now occupied`);
      } else {
        throw new Error('Backend response failed');
      }
    } catch {
      this._table.update(x => x ? { ...x, status: 'occupied' } : x);
      this.toastService.info('Local Update', `Table ${t.number} marked as occupied (local only)`);
    }
  }

  async clearTable(): Promise<void> {
    const t = this._table();
    if (!t) return;
    try {
      // const response = await firstValueFrom(this.restaurantApi.updateTableStatus(t.id, { is_occupied: false }));
      const response = await this.restaurantApi.updateTableStatus(t.id, { is_occupied: false }).toPromise();
      if (response?.success) {
        this._table.update(x => x ? { ...x, status: 'available' } : x);
        this.toastService.success('Table Cleared', `Table ${t.number} is now available`);
      } else {
        throw new Error('Backend response failed');
      }
    } catch {
      this._table.update(x => x ? { ...x, status: 'available' } : x);
      this.toastService.info('Local Update', `Table ${t.number} marked as available (local only)`);
    }
  }

  generateBill(): void {
    const t = this._table();
    if (!t) return;
    this.toastService.info('Generate Bill', `Bill generation for Table ${t.number} - Coming soon!`);
  }

  changeServer(): void {
    const t = this._table();
    if (!t) return;
    this.toastService.info('Change Server', `Server assignment for Table ${t.number} - Coming soon!`);
  }

  async reserveTable(): Promise<void> {
    const t = this._table();
    if (!t) return;
    try {
      const response = await this.restaurantApi.updateTableReservationStatus(t.id, { 
        is_reserved: true 
      }).toPromise();
      if (response?.success) {
        this._table.update(x => x ? { ...x, status: 'reserved' } : x);
        this.toastService.success('Table Reserved', `Table ${t.number} has been reserved`);
      } else {
        throw new Error('Backend response failed');
      }
    } catch {
      this._table.update(x => x ? { ...x, status: 'reserved' } : x);
      this.toastService.info('Local Update', `Table ${t.number} marked as reserved (local only)`);
    }
  }

  async cancelReservation(): Promise<void> {
    const t = this._table();
    if (!t) return;
    try {
      const response = await this.restaurantApi.updateTableReservationStatus(t.id, { 
        is_reserved: false 
      }).toPromise();
      if (response?.success) {
        this._table.update(x => x ? { ...x, status: 'available' } : x);
        this.toastService.success('Reservation Cancelled', `Table ${t.number} is now available`);
      } else {
        throw new Error('Backend response failed');
      }
    } catch {
      this._table.update(x => x ? { ...x, status: 'available' } : x);
      this.toastService.info('Local Update', `Table ${t.number} reservation cancelled (local only)`);
    }
  }
}
