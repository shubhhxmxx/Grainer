import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Dataset } from '../../core/models';
import { PublicDatasetsComponent } from '../public/public.dataset.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatListModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    PublicDatasetsComponent
  ],
  template: `
    <div class="container">
      <div class="grid">
        <mat-card class="stretch">
          <mat-card-header>
            <mat-card-title>{{ isAuthed ? 'Your Topics & Datasets' : 'Welcome to Grain' }}</mat-card-title>
            <mat-card-subtitle *ngIf="!isAuthed">Personalized learning newsletter</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <ng-container *ngIf="isAuthed; else guest">
              <ng-container *ngIf="loading; else list">
                <mat-progress-bar mode="indeterminate"></mat-progress-bar>
              </ng-container>
              <ng-template #list>
                <ng-container *ngIf="datasets.length; else empty">
                  <mat-list>
                    <mat-list-item *ngFor="let ds of datasets; trackBy: trackById">
                      <mat-icon matListItemIcon>folder</mat-icon>
                      <div matListItemTitle>{{ ds.topic || 'Untitled Dataset' }}</div>
                      <div matListItemLine>{{ ds.itemCount || (ds.progress?.lastSentItem || 0) }} items</div>
                      <button mat-button color="primary" [routerLink]="['/dashboard']">Open</button>
                    </mat-list-item>
                  </mat-list>
                </ng-container>
                <ng-template #empty>
                  <p>No datasets yet.</p>
                </ng-template>
              </ng-template>
            </ng-container>

            <ng-template #guest>
              <p>Upload a CSV or subscribe to topics to start receiving your daily newsletter.</p>
              <div class="chips">
                <mat-chip-set>
                  <mat-chip (click)="subscribe('AI')">AI</mat-chip>
                  <mat-chip (click)="subscribe('Web Dev')">Web Dev</mat-chip>
                  <mat-chip (click)="subscribe('Data Science')">Data Science</mat-chip>
                  <mat-chip (click)="subscribe('Finance')">Finance</mat-chip>
                </mat-chip-set>
              </div>
            </ng-template>
          </mat-card-content>

          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="goUpload()">
              <mat-icon>upload_file</mat-icon>
              Upload CSV
            </button>
            <button mat-stroked-button color="primary" (click)="goPreferences()">
              <mat-icon>settings</mat-icon>
              Choose Topics
            </button>
            <span class="spacer"></span>
            <a mat-button *ngIf="!isAuthed" routerLink="/signup">Sign Up</a>
            <a mat-button *ngIf="isAuthed" routerLink="/dashboard">View All</a>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>

    <section style="margin-top: 24px;">
      <app-public-datasets></app-public-datasets>
    </section>
  `,
  styles: [`
    .container { max-width: 1000px; margin: 2rem auto; padding: 0 1rem; }
    .grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
    .stretch { display: flex; flex-direction: column; }
    mat-card-content { margin-top: .5rem; }
    .chips { margin-top: .5rem; }
    .spacer { flex: 1 1 auto; }
  `]
})
export class HomeComponent implements OnInit {
  datasets: Dataset[] = [];
  loading = false;
  isAuthed = false;

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAuthed = this.auth.isAuthenticated();
    if (this.isAuthed) {
      const userId = this.auth.userId!;
      this.loading = true;
      this.api.getDatasets(userId).subscribe({
        next: d => { this.datasets = d; this.loading = false; },
        error: () => { this.loading = false; }
      });
    }
  }

  subscribe(topic: string) {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/subscribe'], { queryParams: { topic } });
    } else {
      this.router.navigate(['/signup'], { queryParams: { redirect: `/subscribe?topic=${encodeURIComponent(topic)}` } });
    }
  }

  goUpload() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/upload']);
    } else {
      this.router.navigate(['/signup'], { queryParams: { redirect: '/upload' } });
    }
  }

  goPreferences() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/preferences']);
    } else {
      this.router.navigate(['/signup'], { queryParams: { redirect: '/preferences' } });
    }
  }

  trackById(i: number, ds: Dataset) { return (ds as any).id ?? i; }
}
