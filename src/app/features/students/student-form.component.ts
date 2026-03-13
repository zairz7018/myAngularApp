import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../services/api.service';
import { SchoolClass } from '../../models/class.model';
import { Department } from '../../models/department.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './student-form.component.html'
})
export class StudentFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  classes: SchoolClass[] = [];
  departments: Department[] = [];
  studentId?: number;
  loading = true;
  saving = false;

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    birthDate: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{8,20}$/)]],
    address: ['', [Validators.required]],
    classId: [0, [Validators.required, Validators.min(1)]],
    departmentId: [0, [Validators.required, Validators.min(1)]],
    enrollmentDate: ['', [Validators.required]],
    status: ['actif' as const, [Validators.required]],
    photoUrl: ['']
  });

  get isEdit(): boolean {
    return Boolean(this.studentId);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.studentId = Number(id);
      forkJoin({
        classes: this.api.getClasses(),
        departments: this.api.getDepartments(),
        student: this.api.getStudent(this.studentId)
      }).subscribe(({ classes, departments, student }) => {
        this.classes = classes;
        this.departments = departments;
        this.form.patchValue(student);
        this.loading = false;
      });
      return;
    }

    forkJoin({
      classes: this.api.getClasses(),
      departments: this.api.getDepartments()
    }).subscribe(({ classes, departments }) => {
      this.classes = classes;
      this.departments = departments;
      this.loading = false;
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const payload = this.form.getRawValue();
    const request$ = this.isEdit && this.studentId
      ? this.api.updateStudent(this.studentId, payload)
      : this.api.createStudent(payload);

    request$.subscribe(() => {
      this.notification.success(this.isEdit ? 'Étudiant mis à jour' : 'Étudiant créé');
      this.saving = false;
      this.router.navigate(['/students']);
    });
  }
}
