import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">🏠 Welcome to the Dashboard</div>

      <div class="table-grid">
        <div class="table-card" *ngFor="let table of tables">
          {{ table }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      padding: 2rem;
      align-items: center;
      gap: 2rem;
    }
    .dashboard-header {
      font-size: 1.5rem;
      font-weight: 600;
    }
    .table-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 1rem;
      width: 100%;
      max-width: 900px;
      justify-items: center;
    }
    .table-card {
      width: 100%;
      height: 100px;
      background-color: #ddd;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }
    .table-card:hover {
      background-color: #ccc;
      transform: scale(1.03);
    }
  `]
})
export class DashboardComponent {
  tables = [
    'Masa A-01',
    'Masa A-02',
    'Masa B-12',
    'Masa B-13',
    'Masa C-137', // gotta respect Rick and Morty
    'Masa VIP',
  ];
}
