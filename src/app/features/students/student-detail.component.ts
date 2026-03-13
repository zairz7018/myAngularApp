import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../services/api.service';
import { Student } from '../../models/student.model';
import { SchoolClass } from '../../models/class.model';
import { Department } from '../../models/department.model';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatProgressBarModule],
  template: `
    @if (loading) {
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
    }

    <mat-card class="page-card" *ngIf="student">
      <h2>{{ student.firstName }} {{ student.lastName }}</h2>

      @if (student.photoUrl) {
        <img [src]="student.photoUrl" [alt]="student.firstName" width="120" />
      }

      <p><strong>ID:</strong> {{ student.id }}</p>
      <p><strong>Date de naissance:</strong> {{ student.birthDate }}</p>
      <p><strong>Email:</strong> {{ student.email }}</p>
      <p><strong>Téléphone:</strong> {{ student.phone }}</p>
      <p><strong>Adresse:</strong> {{ student.address }}</p>
      <p><strong>Classe:</strong> {{ className }}</p>
      <p><strong>Filière:</strong> {{ departmentName }}</p>
      <p><strong>Date d'inscription:</strong> {{ student.enrollmentDate }}</p>
      <p><strong>Statut:</strong> {{ student.status }}</p>

      <div class="actions">
        <button mat-raised-button color="primary" [routerLink]="['/students', student.id, 'edit']">Modifier</button>
        <button mat-button routerLink="/students">Retour</button>
      </div>
    </mat-card>
  `
})
export class StudentDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);

  loading = true;
  student?: Student;
  className = '-';
  departmentName = '-';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    forkJoin({
      student: this.api.getStudent(id),
      classes: this.api.getClasses(),
      departments: this.api.getDepartments()
    }).subscribe(({ student, classes, departments }) => {
      this.student = student;
      this.className = classes.find((item) => item.id === student.classId)?.name ?? `#${student.classId}`;
      this.departmentName = departments.find((item) => item.id === student.departmentId)?.name ?? `#${student.departmentId}`;
      this.loading = false;
    });
  }
}
