import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';
import { SchoolClass } from '../../models/class.model';
import { Department } from '../../models/department.model';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './student-form.component.html'
})
export class StudentFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  classes: SchoolClass[] = [];
  departments: Department[] = [];
  studentId?: number;

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

  get isEdit(): boolean { return Boolean(this.studentId); }

  ngOnInit(): void {
    this.api.getClasses().subscribe(c => this.classes = c);
    this.api.getDepartments().subscribe(d => this.departments = d);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.studentId = Number(id);
      this.api.getStudent(this.studentId).subscribe((student) => this.form.patchValue(student));
    }
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload = this.form.getRawValue();
    const request$ = this.isEdit && this.studentId
      ? this.api.updateStudent(this.studentId, payload)
      : this.api.createStudent(payload);
    request$.subscribe(() => this.router.navigate(['/students']));
  }
}
