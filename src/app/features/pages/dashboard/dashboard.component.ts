import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../../services/api.service';
import { Student } from '../../../models/student.model';
import { SchoolClass } from '../../../models/class.model';

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
  <section class="filters">
    <mat-card class="page-card"><h3>{{ students.length }}</h3><p>Étudiants</p></mat-card>
    <mat-card class="page-card"><h3>{{ classes.length }}</h3><p>Classes</p></mat-card>
    <mat-card class="page-card"><h3>{{ activeCount }}</h3><p>Actifs</p></mat-card>
    <mat-card class="page-card"><h3>{{ departmentsStats }}</h3><p>Répartition filières</p></mat-card>
  </section>
  `
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiService);
  students: Student[] = [];
  classes: SchoolClass[] = [];

  get activeCount(): number { return this.students.filter(s => s.status === 'actif').length; }
  get departmentsStats(): string {
    const counts = this.students.reduce<Record<number, number>>((acc, s) => ({ ...acc, [s.departmentId]: (acc[s.departmentId] ?? 0) + 1 }), {});
    return Object.entries(counts).map(([k, v]) => `#${k}: ${v}`).join(' | ') || '-';
  }

  ngOnInit(): void {
    this.api.getStudents().subscribe(s => this.students = s);
    this.api.getClasses().subscribe(c => this.classes = c);
  }
}
