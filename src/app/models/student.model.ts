export type StudentStatus = 'actif' | 'suspendu' | 'diplome';

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
  classId: number;
  departmentId: number;
  enrollmentDate: string;
  status: StudentStatus;
  photoUrl?: string;
}
