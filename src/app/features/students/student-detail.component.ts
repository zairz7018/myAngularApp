import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';
import { Student } from '../../models/student.model';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  template: `
  <mat-card class="page-card" *ngIf="student">
    <h2>{{ student.firstName }} {{ student.lastName }}</h2>
    <p><strong>ID:</strong> {{ student.id }}</p>
    <p><strong>Naissance:</strong> {{ student.birthDate }}</p>
    <p><strong>Email:</strong> {{ student.email }}</p>
    <p><strong>Téléphone:</strong> {{ student.phone }}</p>
    <p><strong>Adresse:</strong> {{ student.address }}</p>
    <p><strong>Classe:</strong> {{ student.classId }}</p>
    <p><strong>Filière:</strong> {{ student.departmentId }}</p>
    <p><strong>Inscription:</strong> {{ student.enrollmentDate }}</p>
    <p><strong>Statut:</strong> {{ student.status }}</p>
    <button mat-raised-button color="primary" [routerLink]="['/students', student.id, 'edit']">Modifier</button>
  </mat-card>
  `
})
export class StudentDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  student?: Student;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getStudent(id).subscribe((student) => this.student = student);
  }
}
