import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" />
              <mat-error *ngIf="form.get('name')?.hasError('required')">Name is required</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" />
              <mat-error *ngIf="form.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="form.get('email')?.hasError('email')">Invalid email</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" />
              <mat-error *ngIf="form.get('password')?.hasError('required')">Password is required</mat-error>
              <mat-error *ngIf="form.get('password')?.hasError('minlength')">Min 6 chars</mat-error>
            </mat-form-field>
            <button mat-raised-button color="primary" [disabled]="form.invalid || loading" class="full-width">Create account</button>
          </form>
          <mat-progress-bar *ngIf="loading" mode="indeterminate" class="mt-3"></mat-progress-bar>
          <p class="error" *ngIf="error">{{ error }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`.container{max-width:420px;margin:2rem auto;padding:0 1rem}.full-width{width:100%}mat-form-field{margin-bottom:1rem}.mt-3{margin-top:1rem}.error{color:#f44336;margin-top:1rem;text-align:center}`]
})
export class SignupComponent {
  loading = false;
  error?: string;

  form!: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.api.signup(this.form.value as any).subscribe({
      next: (u) => {
        localStorage.setItem('userId', String((u as any).userId));
        localStorage.setItem('email', (u as any).email);
        this.router.navigate(['/upload']);
      },
      error: (e) => { this.error = e?.error?.message || 'Signup failed'; this.loading = false; }
    });
  }
}