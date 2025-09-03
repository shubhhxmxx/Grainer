import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../core/services/api.service';
import { Dataset } from '../../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
    MatIconModule
  ],
  template: `
    <div class="container">
      <h1 class="mat-h1">My Datasets</h1>

      <div class="grid" *ngIf="datasets.length; else noData">
        <mat-card *ngFor="let ds of datasets; trackBy: trackById">
          <mat-card-header>
            <mat-card-title>{{ ds.topic || 'Untitled Dataset' }}</mat-card-title>
            <mat-card-subtitle>{{ ds.itemCount || (ds.progress?.lastSentItem || 0) }} items</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="status-row">
              <mat-chip-set>
                <mat-chip [color]="ds.progress?.status === 'Active' ? 'accent' : undefined">
                  {{ ds.progress?.status || 'Unknown' }}
                </mat-chip>
                <mat-chip *ngIf="ds.useAi">AI Enabled</mat-chip>
              </mat-chip-set>
            </div>

            <mat-progress-bar
              *ngIf="ds.progress?.lastSentItem !== undefined"
              [mode]="'determinate'"
              [value]="((ds.progress?.lastSentItem ?? 0) / (ds.itemCount || 1)) * 100">
            </mat-progress-bar>
          </mat-card-content>
        </mat-card>
      </div>

      <ng-template #noData>
        <mat-card class="empty-state">
          <mat-card-content>
            <p>No datasets uploaded yet.</p>
            <button mat-raised-button color="primary" routerLink="/upload">Upload Your First Dataset</button>
          </mat-card-content>
        </mat-card>
      </ng-template>

      <mat-progress-bar *ngIf="loading" mode="indeterminate" class="loader"></mat-progress-bar>
      <p class="error" *ngIf="error">{{ error }}</p>
    </div>
  `,
  styles: [`.container{max-width:1200px;margin:2rem auto;padding:0 1rem}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem}.status-row{margin:1rem 0}.empty-state{text-align:center;padding:2rem}.empty-state p{margin-bottom:1rem;color:rgba(0,0,0,.6)}.loader{margin:1rem 0}.error{color:#f44336;text-align:center;margin:1rem 0}`]
})
export class DashboardComponent implements OnInit {
  datasets: Dataset[] = [];
  loading = false;
  error?: string;

  constructor(private api: ApiService) {}

  ngOnInit() {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) { this.error = 'Please sign up first'; return; }
    this.loading = true;
    this.api.getDatasets(userId).subscribe({
      next: (data) => { this.datasets = data; this.loading = false; },
      error: (e) => { this.error = e?.error?.message || 'Failed to load datasets'; this.loading = false; }
    });
  }

  trackById(_: number, ds: Dataset) { return (ds as any).id ?? _; }
}
