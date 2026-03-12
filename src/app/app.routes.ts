import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./features/pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'students', loadComponent: () => import('./features/students/student-list.component').then(m => m.StudentListComponent) },
      { path: 'students/new', loadComponent: () => import('./features/students/student-form.component').then(m => m.StudentFormComponent) },
      { path: 'students/:id', loadComponent: () => import('./features/students/student-detail.component').then(m => m.StudentDetailComponent) },
      { path: 'students/:id/edit', loadComponent: () => import('./features/students/student-form.component').then(m => m.StudentFormComponent) },
      { path: 'classes', loadComponent: () => import('./features/classes/classes.component').then(m => m.ClassesComponent) },
      { path: 'departments', loadComponent: () => import('./features/departments/departments.component').then(m => m.DepartmentsComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
