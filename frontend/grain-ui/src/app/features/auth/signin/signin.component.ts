import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatCardModule, MatInputModule, MatButtonModule, MatProgressBarModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header><mat-card-title>Sign In</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" />
              <mat-error *ngIf="form.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="form.get('email')?.hasError('email')">Invalid email</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Name (optional)</mat-label>
              <input matInput formControlName="name" />
            </mat-form-field>
            <button mat-raised-button color="primary" class="full-width" [disabled]="form.invalid || loading">Continue</button>
          </form>
          <mat-progress-bar *ngIf="loading" mode="indeterminate" class="mt-3"></mat-progress-bar>
          <p class="error" *ngIf="error">{{ error }}</p>
          <div class="mt-3">
            <a routerLink="/signup">Create a new account</a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`.container{max-width:420px;margin:2rem auto;padding:0 1rem}.full-width{width:100%}mat-form-field{margin-bottom:1rem}.mt-3{margin-top:1rem}.error{color:#f44336;margin-top:1rem;text-align:center}`]
})
export class SigninComponent {
  loading = false;
  error?: string;
  form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private route: ActivatedRoute) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['']
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = undefined;
    try {
      const { email, name } = this.form.value as { email: string; name?: string };
      await this.auth.signIn(email, name);
      const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/';
      this.router.navigateByUrl(redirect);
    } catch (e: any) {
      this.error = e?.error?.message || 'Sign in failed';
    } finally {
      this.loading = false;
    }
  }
}
