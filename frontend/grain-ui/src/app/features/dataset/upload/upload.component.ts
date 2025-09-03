import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSlideToggleModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header><mat-card-title>Upload Dataset</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Dataset Name</mat-label>
              <input matInput formControlName="topic" />
            </mat-form-field>

            <div class="file-input-container">
              <input #fileInput type="file" accept=".csv" class="file-input" (change)="onFileSelected($event)">
              <button type="button" mat-stroked-button (click)="fileInput.click()">Choose CSV File</button>
              <span class="file-name" *ngIf="fileName">{{ fileName }}</span>
            </div>

            <mat-slide-toggle formControlName="useAi" class="mt-3">Enable AI Enrichment</mat-slide-toggle>

            <button mat-raised-button color="primary" type="submit" [disabled]="!form.value.file || loading" class="full-width mt-3">
              Upload Dataset
            </button>
          </form>

          <mat-progress-bar *ngIf="loading" mode="indeterminate" class="mt-3"></mat-progress-bar>
          <p class="success" *ngIf="success">{{ success }}</p>
          <p class="error" *ngIf="error">{{ error }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`.container{max-width:600px;margin:2rem auto;padding:0 1rem}.full-width{width:100%}.file-input{display:none}.file-input-container{margin:1rem 0}.file-name{margin-left:1rem;color:rgba(0,0,0,.6)}.mt-3{margin-top:1rem}.error{color:#f44336;margin-top:1rem}.success{color:#4caf50;margin-top:1rem}`]
})
export class UploadComponent {
  loading = false;
  error?: string;
  success?: string;
  fileName?: string;

  form!: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      topic: [''],
      useAi: [false],
      file: [null as File | null, Validators.required]
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.fileName = file?.name || undefined;
    this.form.patchValue({ file });
  }

  onSubmit() {
    const file = this.form.value.file;
    if (!file) return;
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) { this.error = 'Please sign up first'; return; }

    this.loading = true;
    this.error = this.success = undefined;

    this.api.uploadDataset(userId, file, !!this.form.value.useAi, this.form.value.topic || undefined)
      .subscribe({
        next: () => { this.success = 'Dataset uploaded successfully'; this.loading = false; this.form.reset(); this.fileName = undefined; },
        error: (e) => { this.error = e?.error?.message || 'Upload failed'; this.loading = false; }
      });
  }
}