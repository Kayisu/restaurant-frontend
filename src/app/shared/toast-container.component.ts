import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../core/services/toast.service';

@Component({
  standalone: true,
  selector: 'app-toast-container',
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="toast toast-{{toast.type}}"
          [class.toast-enter]="true"
        >
          <div class="toast-content">
            <div class="toast-icon">
              @switch (toast.type) {
                @case ('success') { ✅ }
                @case ('error') { ❌ }
                @case ('warning') { ⚠️ }
                @case ('info') { ℹ️ }
              }
            </div>
            <div class="toast-text">
              <div class="toast-title">{{ toast.title }}</div>
              <div class="toast-message">{{ toast.message }}</div>
            </div>
            <button 
              class="toast-close" 
              (click)="toastService.remove(toast.id)"
            >
              ×
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    }

    .toast {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-left: 4px solid;
      overflow: hidden;
      transform: translateY(100%);
      animation: slideUp 0.3s ease-out forwards;
    }

    .toast-enter {
      animation: slideUp 0.3s ease-out forwards;
    }

    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .toast-success {
      border-left-color: #28a745;
    }

    .toast-error {
      border-left-color: #dc3545;
    }

    .toast-warning {
      border-left-color: #ffc107;
    }

    .toast-info {
      border-left-color: #17a2b8;
    }

    .toast-content {
      display: flex;
      align-items: flex-start;
      padding: 12px 16px;
      gap: 12px;
    }

    .toast-icon {
      font-size: 18px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .toast-text {
      flex: 1;
    }

    .toast-title {
      font-weight: 600;
      font-size: 14px;
      color: #333;
      margin-bottom: 4px;
    }

    .toast-message {
      font-size: 13px;
      color: #666;
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      font-size: 20px;
      color: #999;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &:hover {
        color: #666;
      }
    }

    @media (max-width: 480px) {
      .toast-container {
        left: 10px;
        right: 10px;
        bottom: 10px;
        max-width: none;
      }
    }
  `]
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}
