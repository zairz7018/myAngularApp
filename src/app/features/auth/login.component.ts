import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  styles: [
    `.login{display:grid;place-items:center;height:100vh;padding:1rem}`,
    `.card{width:min(420px,90vw)}`,
    `.submit-wrap{display:flex;justify-content:center;margin-top:.5rem}`
  ],
  template: `
    <div class="login">
      <mat-card class="card">
        <h2>Connexion</h2>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" />
            <mat-error *ngIf="form.controls.email.touched && form.controls.email.invalid">Email invalide</mat-error>
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Mot de passe</mat-label>
            <input matInput type="password" formControlName="password" />
            <mat-error *ngIf="form.controls.password.touched && form.controls.password.invalid">Mot de passe requis (min 6 caractères)</mat-error>
          </mat-form-field>

          <div class="submit-wrap">
            <button mat-raised-button color="primary" class="full-width" [disabled]="form.invalid || loading">
              {{ loading ? 'Connexion...' : 'Se connecter' }}
            </button>
          </div>

          @if (loading) {
            <div class="submit-wrap" style="margin-top: 12px">
              <mat-spinner diameter="24"></mat-spinner>
            </div>
          }
        </form>
      </mat-card>
    </div>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.authService
      .login(this.form.getRawValue())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => this.router.navigate(['/dashboard']));
  }
}
