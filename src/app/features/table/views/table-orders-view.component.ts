import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-table-orders-view',
  imports: [CommonModule],
  styleUrl: './styles/table-orders-view.component.scss',
  template: `
    <div class="table-orders-container">
      <div class="orders-header">
        <h2>Table Orders</h2>
        <div class="orders-summary">
          <span class="order-count">0 Active Orders</span>
        </div>
      </div>

      <div class="orders-content">
        <div class="empty-state">
          <div class="empty-icon">🍽️</div>
          <h3>No Active Orders</h3>
          <p>This table currently has no orders. Orders will appear here when customers place them.</p>
          <button class="btn btn-primary" disabled>
            View Order History
          </button>
        </div>
      </div>
    </div>
  `
})
export class TableOrdersViewComponent {
  @Input() tableId: string = '';
  
  // Future: orders will be loaded from backend
  orders: any[] = [];
}
