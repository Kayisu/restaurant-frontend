import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  styleUrl: './dashboard.component.scss',
  template: `
    <div class="dashboard-container">
      <!-- Header Section -->
      <header class="dashboard-header">
        <div class="header-content">
          <h1>Restaurant Dashboard</h1>
          <p class="subtitle">Manage your restaurant tables and orders</p>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <div class="stat-number">{{ availableTables }}</div>
            <div class="stat-label">Available</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ occupiedTables }}</div>
            <div class="stat-label">Occupied</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ reservedTables }}</div>
            <div class="stat-label">Reserved</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ tables.length }}</div>
            <div class="stat-label">Total Tables</div>
          </div>
        </div>
      </header>

      <!-- Tables Section -->
      <section class="tables-section">
        <h2>All Tables</h2>
        <div class="table-grid">
          <div 
            class="table-card" 
            *ngFor="let table of tables; let i = index"
            [class.occupied]="table.status === 'occupied'"
            [class.reserved]="table.status === 'reserved'"
            [class.available]="table.status === 'available'"
            (click)="selectTable(table)"
          >
            <div class="table-number">{{ table.name }}</div>
            <div class="table-status">{{ getStatusText(table.status) }}</div>
            <div class="table-info" *ngIf="table.status !== 'available'">
              <small>{{ table.customerCount }} guests</small>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class DashboardComponent {
  tables = [
    { name: 'Masa A-01', status: 'available', customerCount: 0 },
    { name: 'Masa A-02', status: 'occupied', customerCount: 4 },
    { name: 'Masa B-12', status: 'reserved', customerCount: 2, reservationTime: '19:30' },
    { name: 'Masa B-13', status: 'available', customerCount: 0 },
    { name: 'Masa C-137', status: 'occupied', customerCount: 6 },
    { name: 'Masa VIP', status: 'reserved', customerCount: 8, reservationTime: '20:00' },
    { name: 'Masa A-03', status: 'available', customerCount: 0 },
    { name: 'Masa A-04', status: 'occupied', customerCount: 3 },
  ];

  get availableTables(): number {
    return this.tables.filter(table => table.status === 'available').length;
  }

  get occupiedTables(): number {
    return this.tables.filter(table => table.status === 'occupied').length;
  }

  get reservedTables(): number {
    return this.tables.filter(table => table.status === 'reserved').length;
  }

  getReservedTables() {
    return this.tables.filter(table => table.status === 'reserved');
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'available': return 'Available';
      case 'occupied': return 'Occupied';
      case 'reserved': return 'Reserved';
      default: return 'Unknown';
    }
  }

  selectTable(table: any): void {
    console.log('Selected table:', table);
    // Here you can add logic to open table details, make reservations, etc.
    alert(`Table ${table.name} selected!\nStatus: ${this.getStatusText(table.status)}`);
  }
}
