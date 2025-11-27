import { ResultSetHeader } from 'mysql2/promise';
import pool from '@/util/database';
import { Student } from '@/util/types';

export const getStudent = async (id: number): Promise<Student | undefined> => {
  const [result] = await pool.execute<Student[]>(
    'SELECT * FROM `students` WHERE `id` = ?',
    [id]
  );

  return result[0];
};

export const getStudents = async (): Promise<Student[] | undefined> => {
  const [result] = await pool.execute<Student[]>('SELECT * FROM `students`');

  return result;
};

export const createStudent = async (
  name: string,
  email: string,
  birthdate: string
): Promise<ResultSetHeader> => {
  const [result] = await pool.execute(
    'INSERT INTO `students` (`name`, `email`, `birthdate`) VALUES (?, ?, ?)',
    [name, email, birthdate]
  );

  return result as ResultSetHeader;
};

export const updateStudent = async (
  id: number,
  name?: string,
  email?: string,
  birthdate?: string
): Promise<ResultSetHeader> => {
  const updates: string[] = [];
  const values: any[] = [];

  if (name !== undefined) {
    updates.push('`name` = ?');
    values.push(name);
  }
  if (email !== undefined) {
    updates.push('`email` = ?');
    values.push(email);
  }
  if (birthdate !== undefined) {
    updates.push('`birthdate` = ?');
    values.push(birthdate);
  }

  values.push(id);
  const [result] = await pool.execute(
    `UPDATE \`students\` SET ${updates.join(', ')} WHERE \`id\` = ?`,
    values
  );

  return result as ResultSetHeader;
};

export const deleteStudent = async (id: number): Promise<void> => {
  await pool.execute('DELETE FROM `students` WHERE `id` = ?', [id]);
};
