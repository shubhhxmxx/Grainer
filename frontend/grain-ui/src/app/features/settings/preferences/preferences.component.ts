import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService } from '../../../core/services/api.service';
import { Dataset } from '../../../core/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatFormFieldModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header><mat-card-title>Learning Preferences</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubscribe()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Select a public topic</mat-label>
              <mat-select formControlName="datasetId" required>
                <mat-option *ngFor="let t of publicTopics" [value]="t.id">
                  {{ t.topic }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email Frequency</mat-label>
              <mat-select formControlName="frequency" required>
                <mat-option value="daily">Daily</mat-option>
                <mat-option value="weekly">Weekly</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-slide-toggle formControlName="useAi" class="mt-3">Enable AI Enrichment</mat-slide-toggle>

            <button mat-raised-button color="primary" type="submit" [disabled]="saving" class="full-width mt-3">
              Subscribe
            </button>
          </form>

          <mat-progress-bar *ngIf="loading" mode="indeterminate" class="mt-3"></mat-progress-bar>
          <p class="success" *ngIf="success">{{ success }}</p>
          <p class="error" *ngIf="error">{{ error }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`.container{max-width:600px;margin:2rem auto;padding:0 1rem}.full-width{width:100%}mat-form-field{margin-bottom:1rem}.mt-3{margin-top:1rem}.error{color:#f44336;margin-top:1rem}.success{color:#4caf50;margin-top:1rem}`]
})
export class PreferencesComponent implements OnInit {
  // Use id + topic pairs from /datasets/public
  publicTopics: { id: number; topic: string }[] = [];
  loading = false;
  saving = false;
  userId = 0;
  error?: string;
  success?: string;

  form = new FormGroup({
    datasetId: new FormControl<number | null>(null, Validators.required),
    frequency: new FormControl<'daily' | 'weekly'>('daily', Validators.required),
    useAi: new FormControl<boolean>(false)
  });

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.userId = Number(localStorage.getItem('userId')) || 0;
    this.loading = true;

    // Use the typed helper to avoid Dataset -> {id, topic} mismatch
    this.api.getPublicTopics().subscribe({
      next: (topics) => {
        this.publicTopics = topics;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSubscribe() {
    if (!this.userId) { this.snack.open('Please sign in', 'Dismiss', { duration: 2500 }); return; }
    const datasetId = Number(this.form.value.datasetId);
    if (!datasetId) { this.snack.open('Select a topic', 'Dismiss', { duration: 2000 }); return; }

    this.saving = true;
    this.api.subscribeToDataset({
      userId: this.userId,
      datasetId,
      frequency: this.form.value.frequency!,
      aiEnabled: this.form.value.useAi!
    }).subscribe({
      next: (res: any) => {
        const msg = res?.message || res?.status || 'Subscribed';
        this.success = msg;
        this.snack.open(msg, 'OK', { duration: 3000 });
        this.saving = false;
      },
      error: (e) => {
        const msg = e?.error?.message || 'Failed to subscribe';
        this.error = msg;
        this.snack.open(msg, 'Dismiss', { duration: 3500 });
        this.saving = false;
      }
    });
  }
}