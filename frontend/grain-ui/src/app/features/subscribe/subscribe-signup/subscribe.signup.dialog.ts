import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-subscribe-signup-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Finish signup</h2>
    <div mat-dialog-content [formGroup]="form">
      <p>We couldn’t find an account for {{ data.email }}. Enter your name to create one.</p>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" />
        <mat-error *ngIf="form.get('name')?.hasError('required')">Name is required</mat-error>
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid">Create</button>
    </div>
  `
})
export class SubscribeSignupDialog {
  private fb = inject(FormBuilder);
  form = this.fb.group({ name: ['', Validators.required] });

  constructor(
    public dialogRef: MatDialogRef<SubscribeSignupDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { email: string }
  ) {}
  save() { this.dialogRef.close(this.form.value); }
}
