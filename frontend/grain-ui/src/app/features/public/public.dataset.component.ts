import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../core/services/api.service';
import { Dataset } from '../../core/models';
import { SubscribeEmailDialog } from '../subscribe/subscribe.email.dialog/subscribe.email.dialog';
import { SubscribeSignupDialog } from '../subscribe/subscribe-signup/subscribe.signup.dialog';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-public-datasets',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, MatListModule, MatIconModule,
    MatButtonModule, MatProgressBarModule,
    MatSnackBarModule, MatDialogModule
  ],
  template: `
    <div class="container">
      <mat-card class="stretch">
        <mat-card-header>
          <mat-card-title>Public Datasets</mat-card-title>
          <mat-card-subtitle>Browse and subscribe</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <ng-container *ngIf="loading; else list">
            <mat-progress-bar mode="indeterminate"></mat-progress-bar>
          </ng-container>
          <ng-template #list>
            <ng-container *ngIf="datasets.length; else empty">
              <mat-list>
                <mat-list-item *ngFor="let ds of datasets; trackBy: trackById">
                  <mat-icon matListItemIcon>public</mat-icon>
                  <div matListItemTitle>{{ ds.topic }}</div>
                  <div matListItemLine>{{ ds.itemCount }} items</div>
                  <button mat-stroked-button color="primary" (click)="onSubscribe(ds)">Subscribe</button>
                </mat-list-item>
              </mat-list>
            </ng-container>
            <ng-template #empty><p>No public datasets found.</p></ng-template>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`.container{max-width:900px;margin:2rem auto;padding:0 1rem}.stretch{display:flex;flex-direction:column}`]
})
export class PublicDatasetsComponent implements OnInit {
  datasets: Dataset[] = [];
  loading = false;

  // trackBy required to avoid template runtime error
  trackById = (_: number, ds: Dataset) => Number((ds as any)?.id ?? -1);

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    console.log('[PublicDatasetsComponent] init');
    this.loading = true;
    this.api.getPublicDatasets().subscribe({
      next: (d: Dataset[]) => {
        console.log('[Public] received', d);
        this.datasets = d;
        this.loading = false;
      },
      error: (e) => {
        console.error('[Public] error', e);
        this.loading = false;
      }
    });
  }

  onSubscribe(ds: Dataset) {
    const datasetId = Number((ds as any)?.id);
    if (this.auth.isAuthenticated()) {
      const userId = this.auth.userId!;
      this.subscribeNow(userId, datasetId);
      return;
    }

    const ref = this.dialog.open(SubscribeEmailDialog, {
      data: { datasetId, topic: ds.topic },
      width: '420px'
    });
    ref.afterClosed().subscribe((val?: { email: string }) => {
      if (!val?.email) return;
      const email = val.email;

      this.api.signin({ email }).subscribe({
        next: (user: any): void => {
          const userId = Number(user?.userId) || null;
          if (userId) {
            this.subscribeNow(userId, datasetId);
          } else {
            const sref = this.dialog.open(SubscribeSignupDialog, { data: { email }, width: '360px' });
            sref.afterClosed().subscribe((signup?: { name: string }) => {
              if (!signup?.name) return;
              this.api.signup({ name: signup.name, email }).subscribe({
                next: (newUser: any): void => {
                  const newUserId = Number(newUser?.userId) || null;
                  if (!newUserId) {
                    this.snack.open('Signup did not return userId', 'Dismiss', { duration: 3500 });
                    return;
                  }
                  this.subscribeNow(newUserId, datasetId);
                },
                error: (se: any): void => { this.snack.open(se?.error?.message || 'Signup failed', 'Dismiss', { duration: 3500 }); }
              });
            });
          }
        },
        error: (e: any): void => { this.snack.open(e?.error?.message || 'Sign-in failed', 'Dismiss', { duration: 3500 }); }
      });
    });
  }

  private subscribeNow(userId: number, datasetId: number) {
    this.api.subscribeToDataset({ userId, datasetId, frequency: 'daily', useAi: false }).subscribe({
      next: (res: any): void => {
        this.snack.open(res?.message || 'Subscribed', 'OK', { duration: 2500 });
        // Navigate so the dashboard fetches the updated userDataSets including the new entry
        // Inject Router if not already
        // this.router.navigate(['/dashboard']);
      },
      error: (e: any): void => { this.snack.open(e?.error?.message || 'Failed to subscribe', 'Dismiss', { duration: 3500 }); }
    });
  }
}
