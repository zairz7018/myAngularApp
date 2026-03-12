import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Student } from '../models/student.model';
import { SchoolClass } from '../models/class.model';
import { Department } from '../models/department.model';
import { LoginPayload, AuthResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  login(payload: LoginPayload): Observable<AuthResponse> { return this.http.post<AuthResponse>(`${this.base}/auth/login`, payload); }
  getStudents(params?: Record<string, string | number>): Observable<Student[]> {
    let httpParams = new HttpParams();
    Object.entries(params ?? {}).forEach(([k, v]) => httpParams = httpParams.set(k, String(v)));
    return this.http.get<Student[]>(`${this.base}/students`, { params: httpParams });
  }
  getStudent(id: number): Observable<Student> { return this.http.get<Student>(`${this.base}/students/${id}`); }
  createStudent(payload: Omit<Student, 'id'>): Observable<Student> { return this.http.post<Student>(`${this.base}/students`, payload); }
  updateStudent(id: number, payload: Omit<Student, 'id'>): Observable<Student> { return this.http.put<Student>(`${this.base}/students/${id}`, payload); }
  deleteStudent(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/students/${id}`); }
  getClasses(): Observable<SchoolClass[]> { return this.http.get<SchoolClass[]>(`${this.base}/classes`); }
  createClass(payload: Omit<SchoolClass, 'id'>): Observable<SchoolClass> { return this.http.post<SchoolClass>(`${this.base}/classes`, payload); }
  updateClass(id: number, payload: Omit<SchoolClass, 'id'>): Observable<SchoolClass> { return this.http.put<SchoolClass>(`${this.base}/classes/${id}`, payload); }
  deleteClass(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/classes/${id}`); }
  getDepartments(): Observable<Department[]> { return this.http.get<Department[]>(`${this.base}/departments`); }
  createDepartment(payload: Omit<Department, 'id'>): Observable<Department> { return this.http.post<Department>(`${this.base}/departments`, payload); }
  updateDepartment(id: number, payload: Omit<Department, 'id'>): Observable<Department> { return this.http.put<Department>(`${this.base}/departments/${id}`, payload); }
  deleteDepartment(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/departments/${id}`); }
}
