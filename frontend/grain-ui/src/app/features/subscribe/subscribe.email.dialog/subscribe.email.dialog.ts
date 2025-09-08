import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-subscribe-email-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Subscribe to "{{ data.topic }}"</h2>
    <div mat-dialog-content [formGroup]="form">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Email</mat-label>
        <input matInput type="email" formControlName="email" placeholder="you@example.com" />
        <mat-error *ngIf="form.get('email')?.hasError('required')">Email is required</mat-error>
        <mat-error *ngIf="form.get('email')?.hasError('email')">Invalid email</mat-error>
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid">Subscribe</button>
    </div>
  `,
  styles: [`.full-width{width:100%}`]
})
export class SubscribeEmailDialog {
  private fb = inject(FormBuilder);
  form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });

  constructor(
    public dialogRef: MatDialogRef<SubscribeEmailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { datasetId: number; topic: string }
  ) {}
  save() { this.dialogRef.close(this.form.value); }
}