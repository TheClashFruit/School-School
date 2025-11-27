import { RowDataPacket } from 'mysql2/promise';

export interface Student extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  birthdate: Date;
}

export interface Course extends RowDataPacket {
  id: number;
  title: string;
  description: string;
}

export interface Enrollment extends RowDataPacket {
  id: number;
  student_id: number;
  course_id: number;
  enrolled_at: Date;
}
