import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { Student } from '../../models/student.model';
import { ConfirmDialogComponent } from './components/confirm-dialog.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDialogModule],
  templateUrl: './student-list.component.html'
})
export class StudentListComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  displayedColumns = ['lastName', 'firstName', 'email', 'status', 'enrollmentDate', 'actions'];
  dataSource = new MatTableDataSource<Student>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.load();
    this.dataSource.filterPredicate = (data, filter) => JSON.stringify(data).toLowerCase().includes(filter);
  }

  load(): void {
    this.api.getStudents().subscribe((students) => {
      this.dataSource.data = students;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  view(student: Student): void { this.router.navigate(['/students', student.id]); }
  edit(student: Student): void { this.router.navigate(['/students', student.id, 'edit']); }

  delete(student: Student): void {
    this.dialog.open(ConfirmDialogComponent, { data: { message: `Supprimer ${student.firstName} ${student.lastName} ?` } })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.api.deleteStudent(student.id).subscribe(() => this.load());
        }
      });
  }
}
