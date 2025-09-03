import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ApiService } from '../../../core/services/api.service';
import { Preferences } from '../../../core/models';
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
    MatSlideToggleModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header><mat-card-title>Learning Preferences</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Topics (comma-separated)</mat-label>
              <input matInput [value]="topicsCsv" (input)="onTopicsCsvChange($event)" placeholder="news, tech, science">
              <mat-hint>Enter topics separated by commas</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email Frequency</mat-label>
              <mat-select formControlName="frequency">
                <mat-option value="daily">Daily</mat-option>
                <mat-option value="weekly">Weekly</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-slide-toggle formControlName="useAi" class="mt-3">Enable AI Enrichment</mat-slide-toggle>

            <button mat-raised-button color="primary" type="submit" [disabled]="loading" class="full-width mt-3">
              Save Preferences
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
export class PreferencesComponent {
  loading = false;
  error?: string;
  success?: string;

  form!: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService, private route: ActivatedRoute) {
    this.form = this.fb.group({
      topics: [[] as string[]],
      frequency: ['daily', Validators.required],
      useAi: [false]
    });

    const saved = localStorage.getItem('prefs');
    if (saved) {
      try { this.form.setValue(JSON.parse(saved)); } catch {}
    }

    const prefill = this.route.snapshot.queryParamMap.get('prefillTopic');
    if (prefill) {
      const topics = new Set<string>([...(this.form.value.topics || []), prefill]);
      this.form.patchValue({ topics: Array.from(topics) });
    }
  }

  get topicsCsv(): string {
    return (this.form.value.topics || []).join(', ');
  }

  onTopicsCsvChange(e: Event) {
    const value = (e.target as HTMLInputElement).value || '';
    const topics = value.split(',').map(s => s.trim()).filter(Boolean);
    this.form.patchValue({ topics });
  }

  onSubmit() {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) { this.error = 'Please sign up first'; return; }

    this.loading = true;
    this.error = this.success = undefined;

    const prefs = this.form.value as Preferences;
    localStorage.setItem('prefs', JSON.stringify(prefs));
    this.api.savePreferences(userId, prefs).subscribe({
      next: () => { this.success = 'Preferences saved'; this.loading = false; },
      error: (e) => { this.error = e?.error?.message || 'Failed to save preferences'; this.loading = false; }
    });
  }
}