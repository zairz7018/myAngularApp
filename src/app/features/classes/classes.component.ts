import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';
import { SchoolClass } from '../../models/class.model';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
  <section class="page-card">
    <h2>Classes</h2>
    <form [formGroup]="form" (ngSubmit)="save()" class="actions">
      <mat-form-field><mat-label>Nom</mat-label><input matInput formControlName="name"></mat-form-field>
      <mat-form-field><mat-label>Niveau</mat-label><input matInput formControlName="level"></mat-form-field>
      <button mat-raised-button color="primary">{{ editId ? 'Mettre à jour' : 'Ajouter' }}</button>
    </form>
    <table mat-table [dataSource]="classes">
      <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Nom</th><td mat-cell *matCellDef="let c">{{ c.name }}</td></ng-container>
      <ng-container matColumnDef="level"><th mat-header-cell *matHeaderCellDef>Niveau</th><td mat-cell *matCellDef="let c">{{ c.level }}</td></ng-container>
      <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th><td mat-cell *matCellDef="let c"><button mat-button (click)="edit(c)">Edit</button><button mat-button color="warn" (click)="remove(c.id)">Suppr</button></td></ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr><tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  </section>
  `
})
export class ClassesComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  classes: SchoolClass[] = [];
  editId?: number;
  displayedColumns = ['name', 'level', 'actions'];
  form = this.fb.nonNullable.group({ name: ['', Validators.required], level: ['', Validators.required] });

  ngOnInit(): void { this.load(); }

  load(): void { this.api.getClasses().subscribe(c => this.classes = c); }
  edit(item: SchoolClass): void { this.editId = item.id; this.form.patchValue(item); }
  remove(id: number): void { this.api.deleteClass(id).subscribe(() => this.load()); }

  save(): void {
    if (this.form.invalid) return;
    const payload = this.form.getRawValue();
    const request$ = this.editId ? this.api.updateClass(this.editId, payload) : this.api.createClass(payload);
    request$.subscribe(() => { this.load(); this.form.reset({ name: '', level: '' }); this.editId = undefined; });
  }
}
