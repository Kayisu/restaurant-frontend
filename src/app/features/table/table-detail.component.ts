import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-table-detail',
  imports: [CommonModule],
  styleUrl: './table-detail.component.scss',
  template: `
    <div class="table-detail-container">
      <div class="table-header">
        <button class="back-btn" (click)="goBack()">
          ← Back to Dashboard
        </button>
        <h1>Table {{ tableId }}</h1>
      </div>

      <div class="table-content">
        <p>Table detail content will be implemented here...</p>
      </div>
    </div>
  `
})
export class TableDetailComponent implements OnInit {
  tableId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.tableId = params['tableId'];
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
