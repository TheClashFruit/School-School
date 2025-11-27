import { ResultSetHeader } from 'mysql2/promise';
import pool from '@/util/database';
import { Enrollment } from '@/util/types';

export const getEnrollment = async (
  id: number
): Promise<Enrollment | undefined> => {
  const [result] = await pool.execute<Enrollment[]>(
    'SELECT * FROM `enrollments` WHERE `id` = ?',
    [id]
  );

  return result[0];
};

export const getEnrollments = async (): Promise<Enrollment[] | undefined> => {
  const [result] = await pool.execute<Enrollment[]>(
    'SELECT * FROM `enrollments`'
  );

  return result;
};

export const getEnrollmentsByStudent = async (
  studentId: number
): Promise<Enrollment[] | undefined> => {
  const [result] = await pool.execute<Enrollment[]>(
    'SELECT * FROM `enrollments` WHERE `student_id` = ?',
    [studentId]
  );

  return result;
};

export const getEnrollmentsByCourse = async (
  courseId: number
): Promise<Enrollment[] | undefined> => {
  const [result] = await pool.execute<Enrollment[]>(
    'SELECT * FROM `enrollments` WHERE `course_id` = ?',
    [courseId]
  );

  return result;
};

export const createEnrollment = async (
  studentId: number,
  courseId: number
): Promise<ResultSetHeader> => {
  const [result] = await pool.execute(
    'INSERT INTO `enrollments` (`student_id`, `course_id`) VALUES (?, ?)',
    [studentId, courseId]
  );

  return result as ResultSetHeader;
};

export const deleteEnrollment = async (id: number): Promise<void> => {
  await pool.execute('DELETE FROM `enrollments` WHERE `id` = ?', [id]);
};
