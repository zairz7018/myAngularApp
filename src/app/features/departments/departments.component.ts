import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../services/api.service';
import { Department } from '../../models/department.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressBarModule],
  template: `
    <section class="page-card">
      <h2>Filières</h2>

      @if (loading) {
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      }

      <form [formGroup]="form" (ngSubmit)="save()" class="actions">
        <mat-form-field><mat-label>Nom</mat-label><input matInput formControlName="name" /></mat-form-field>
        <mat-form-field><mat-label>Code</mat-label><input matInput formControlName="code" /></mat-form-field>
        <button mat-raised-button color="primary">{{ editId ? 'Mettre à jour' : 'Ajouter' }}</button>
      </form>

      <table mat-table [dataSource]="departments">
        <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Nom</th><td mat-cell *matCellDef="let d">{{ d.name }}</td></ng-container>
        <ng-container matColumnDef="code"><th mat-header-cell *matHeaderCellDef>Code</th><td mat-cell *matCellDef="let d">{{ d.code }}</td></ng-container>
        <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th><td mat-cell *matCellDef="let d"><button mat-button (click)="edit(d)">Éditer</button><button mat-button color="warn" (click)="remove(d.id)">Supprimer</button></td></ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </section>
  `
})
export class DepartmentsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);

  loading = true;
  departments: Department[] = [];
  editId?: number;
  displayedColumns = ['name', 'code', 'actions'];
  form = this.fb.nonNullable.group({ name: ['', Validators.required], code: ['', Validators.required] });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getDepartments().subscribe((departments) => {
      this.departments = departments;
      this.loading = false;
    });
  }

  edit(item: Department): void {
    this.editId = item.id;
    this.form.patchValue(item);
  }

  remove(id: number): void {
    this.api.deleteDepartment(id).subscribe(() => {
      this.notification.success('Filière supprimée');
      this.load();
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    const request$ = this.editId ? this.api.updateDepartment(this.editId, payload) : this.api.createDepartment(payload);

    request$.subscribe(() => {
      this.notification.success(this.editId ? 'Filière mise à jour' : 'Filière ajoutée');
      this.load();
      this.form.reset({ name: '', code: '' });
      this.editId = undefined;
    });
  }
}
