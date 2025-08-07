import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-add-order-view',
  imports: [CommonModule],
  styleUrl: './styles/add-order-view.component.scss',
  template: `
    <div class="add-order-container">
      <div class="add-order-header">
        <h2>Add New Order</h2>
        <div class="table-info">
          <span class="table-id">Table {{ tableId }}</span>
        </div>
      </div>

      <div class="add-order-content">
        <div class="coming-soon-state">
          <div class="coming-soon-icon">🚧</div>
          <h3>Order Management Coming Soon</h3>
          <p>The order management system is currently under development. This feature will allow you to:</p>
          
          <div class="feature-list">
            <div class="feature-item">
              <span class="feature-icon">✅</span>
              <span class="feature-text">Browse menu items</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✅</span>
              <span class="feature-text">Add items to order</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✅</span>
              <span class="feature-text">Customize item options</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✅</span>
              <span class="feature-text">Calculate totals automatically</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✅</span>
              <span class="feature-text">Send orders to kitchen</span>
            </div>
          </div>

          <button class="btn btn-primary" disabled>
            Start New Order
          </button>
        </div>

        <!-- Future: Order creation interface will be here -->
        <!-- 
        <div class="order-form">
          <div class="menu-categories">
            <button class="category-btn" *ngFor="let category of menuCategories">
              {{ category.name }}
            </button>
          </div>
          
          <div class="menu-items">
            <div class="menu-item" *ngFor="let item of currentCategoryItems">
              <div class="item-info">
                <h4>{{ item.name }}</h4>
                <p>{{ item.description }}</p>
                <span class="item-price">₺{{ item.price }}</span>
              </div>
              <button class="add-btn">Add to Order</button>
            </div>
          </div>
          
          <div class="current-order">
            <h3>Current Order</h3>
            <div class="order-items">
              <div class="order-item" *ngFor="let item of currentOrder">
                <span>{{ item.name }} x{{ item.quantity }}</span>
                <span>₺{{ item.total }}</span>
              </div>
            </div>
            <div class="order-total">
              Total: ₺{{ orderTotal }}
            </div>
            <button class="btn btn-success">Confirm Order</button>
          </div>
        </div>
        -->
      </div>
    </div>
  `
})
export class AddOrderViewComponent {
  @Input() tableId: string = '';
  
  // Future: menu items and order management
  menuCategories: any[] = [];
  currentOrder: any[] = [];
  orderTotal: number = 0;
}
