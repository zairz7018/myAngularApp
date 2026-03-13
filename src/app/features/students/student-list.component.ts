import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { Student } from '../../models/student.model';
import { Department } from '../../models/department.model';
import { SchoolClass } from '../../models/class.model';
import { ConfirmDialogComponent } from './components/confirm-dialog.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatProgressBarModule
  ],
  templateUrl: './student-list.component.html'
})
export class StudentListComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(NotificationService);

  displayedColumns = ['lastName', 'firstName', 'email', 'class', 'department', 'status', 'enrollmentDate', 'actions'];
  dataSource = new MatTableDataSource<Student>([]);
  loading = true;

  classes: SchoolClass[] = [];
  departments: Department[] = [];

  filtersForm = this.fb.nonNullable.group({
    search: [''],
    classId: ['all'],
    departmentId: ['all'],
    status: ['all']
  });

  private allStudents: Student[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: Student, filter: string) => {
      return (`${data.firstName} ${data.lastName} ${data.email}`.toLowerCase()).includes(filter);
    };

    this.load();
    this.filtersForm.valueChanges.subscribe(() => this.applyFilters());
  }

  load(): void {
    this.loading = true;
    forkJoin({
      students: this.api.getStudents(),
      classes: this.api.getClasses(),
      departments: this.api.getDepartments()
    }).subscribe(({ students, classes, departments }) => {
      this.allStudents = students;
      this.classes = classes;
      this.departments = departments;
      this.applyFilters();
      this.loading = false;
    });
  }

  applyFilters(): void {
    const { search, classId, departmentId, status } = this.filtersForm.getRawValue();
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = this.allStudents.filter((student) => {
      const matchesSearch = !normalizedSearch
        || `${student.firstName} ${student.lastName} ${student.email}`.toLowerCase().includes(normalizedSearch);
      const matchesClass = classId === 'all' || student.classId === Number(classId);
      const matchesDepartment = departmentId === 'all' || student.departmentId === Number(departmentId);
      const matchesStatus = status === 'all' || student.status === status;

      return matchesSearch && matchesClass && matchesDepartment && matchesStatus;
    });

    this.dataSource.data = filtered;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  className(classId: number): string {
    return this.classes.find((item) => item.id === classId)?.name ?? `#${classId}`;
  }

  departmentName(departmentId: number): string {
    return this.departments.find((item) => item.id === departmentId)?.name ?? `#${departmentId}`;
  }

  view(student: Student): void {
    this.router.navigate(['/students', student.id]);
  }

  edit(student: Student): void {
    this.router.navigate(['/students', student.id, 'edit']);
  }

  delete(student: Student): void {
    this.dialog
      .open(ConfirmDialogComponent, { data: { message: `Supprimer ${student.firstName} ${student.lastName} ?` } })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.api.deleteStudent(student.id).subscribe(() => {
            this.notification.success('Étudiant supprimé avec succès');
            this.load();
          });
        }
      });
  }
}
