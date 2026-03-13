import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../services/api.service';
import { SchoolClass } from '../../models/class.model';
import { Student } from '../../models/student.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressBarModule],
  template: `
    <section class="page-card">
      <h2>Classes</h2>

      @if (loading) {
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      }

      <form [formGroup]="form" (ngSubmit)="save()" class="actions">
        <mat-form-field><mat-label>Nom</mat-label><input matInput formControlName="name" /></mat-form-field>
        <mat-form-field><mat-label>Niveau</mat-label><input matInput formControlName="level" /></mat-form-field>
        <button mat-raised-button color="primary">{{ editId ? 'Mettre à jour' : 'Ajouter' }}</button>
      </form>

      <table mat-table [dataSource]="classes">
        <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Nom</th><td mat-cell *matCellDef="let c">{{ c.name }}</td></ng-container>
        <ng-container matColumnDef="level"><th mat-header-cell *matHeaderCellDef>Niveau</th><td mat-cell *matCellDef="let c">{{ c.level }}</td></ng-container>
        <ng-container matColumnDef="students"><th mat-header-cell *matHeaderCellDef>Étudiants</th><td mat-cell *matCellDef="let c">{{ countStudents(c.id) }}</td></ng-container>
        <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th><td mat-cell *matCellDef="let c"><button mat-button (click)="edit(c)">Éditer</button><button mat-button color="warn" (click)="remove(c.id)">Supprimer</button></td></ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </section>
  `
})
export class ClassesComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);

  loading = true;
  classes: SchoolClass[] = [];
  students: Student[] = [];
  editId?: number;
  displayedColumns = ['name', 'level', 'students', 'actions'];
  form = this.fb.nonNullable.group({ name: ['', Validators.required], level: ['', Validators.required] });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    forkJoin({
      classes: this.api.getClasses(),
      students: this.api.getStudents()
    }).subscribe(({ classes, students }) => {
      this.classes = classes;
      this.students = students;
      this.loading = false;
    });
  }

  countStudents(classId: number): number {
    return this.students.filter((student) => student.classId === classId).length;
  }

  edit(item: SchoolClass): void {
    this.editId = item.id;
    this.form.patchValue(item);
  }

  remove(id: number): void {
    this.api.deleteClass(id).subscribe(() => {
      this.notification.success('Classe supprimée');
      this.load();
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    const request$ = this.editId ? this.api.updateClass(this.editId, payload) : this.api.createClass(payload);

    request$.subscribe(() => {
      this.notification.success(this.editId ? 'Classe mise à jour' : 'Classe ajoutée');
      this.load();
      this.form.reset({ name: '', level: '' });
      this.editId = undefined;
    });
  }
}
