import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../../services/api.service';
import { Student } from '../../../models/student.model';
import { SchoolClass } from '../../../models/class.model';
import { Department } from '../../../models/department.model';

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule],
  template: `
    <h1>Tableau de bord</h1>

    @if (loading) {
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
    }

    <section class="filters" *ngIf="!loading">
      <mat-card class="page-card stat-card">
        <h3>{{ students.length }}</h3>
        <p>Étudiants</p>
      </mat-card>
      <mat-card class="page-card stat-card">
        <h3>{{ classes.length }}</h3>
        <p>Classes</p>
      </mat-card>
      <mat-card class="page-card stat-card">
        <h3>{{ activeCount }}</h3>
        <p>Étudiants actifs</p>
      </mat-card>
      <mat-card class="page-card stat-card">
        <h3>{{ departments.length }}</h3>
        <p>Filières</p>
      </mat-card>
    </section>

    <mat-card class="page-card" *ngIf="!loading">
      <h2>Répartition par filière</h2>
      @for (item of departmentStats; track item.departmentId) {
        <p><strong>{{ item.departmentName }}:</strong> {{ item.count }} étudiant(s)</p>
      } @empty {
        <p>Aucune donnée</p>
      }
    </mat-card>
  `
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiService);

  loading = true;
  students: Student[] = [];
  classes: SchoolClass[] = [];
  departments: Department[] = [];

  get activeCount(): number {
    return this.students.filter((s) => s.status === 'actif').length;
  }

  get departmentStats(): Array<{ departmentId: number; departmentName: string; count: number }> {
    const departmentMap = new Map(this.departments.map((department) => [department.id, department.name]));
    const counts = this.students.reduce<Record<number, number>>((acc, student) => {
      acc[student.departmentId] = (acc[student.departmentId] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([departmentId, count]) => ({
        departmentId: Number(departmentId),
        departmentName: departmentMap.get(Number(departmentId)) ?? `Filière #${departmentId}`,
        count
      }))
      .sort((a, b) => b.count - a.count);
  }

  ngOnInit(): void {
    forkJoin({
      students: this.api.getStudents(),
      classes: this.api.getClasses(),
      departments: this.api.getDepartments()
    }).subscribe(({ students, classes, departments }) => {
      this.students = students;
      this.classes = classes;
      this.departments = departments;
      this.loading = false;
    });
  }
}
