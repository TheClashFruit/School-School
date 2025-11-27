import { ResultSetHeader } from 'mysql2/promise';
import pool from '@/util/database';
import { Course } from '@/util/types';

export const getCourse = async (id: number): Promise<Course | undefined> => {
  const [result] = await pool.execute<Course[]>(
    'SELECT * FROM `courses` WHERE `id` = ?',
    [id]
  );

  return result[0];
};

export const getCourses = async (): Promise<Course[] | undefined> => {
  const [result] = await pool.execute<Course[]>('SELECT * FROM `courses`');

  return result;
};

export const createCourse = async (
  title: string,
  description: string
): Promise<ResultSetHeader> => {
  const [result] = await pool.execute(
    'INSERT INTO `courses` (`title`, `description`) VALUES (?, ?)',
    [title, description]
  );

  return result as ResultSetHeader;
};

export const updateCourse = async (
  id: number,
  title?: string,
  description?: string
): Promise<ResultSetHeader> => {
  const updates: string[] = [];
  const values: (string | number)[] = [];

  if (title !== undefined) {
    updates.push('`title` = ?');
    values.push(title);
  }
  if (description !== undefined) {
    updates.push('`description` = ?');
    values.push(description);
  }

  values.push(id);
  const [result] = await pool.execute(
    `UPDATE \`courses\` SET ${updates.join(', ')} WHERE \`id\` = ?`,
    values
  );

  return result as ResultSetHeader;
};

export const deleteCourse = async (id: number): Promise<void> => {
  await pool.execute('DELETE FROM `courses` WHERE `id` = ?', [id]);
};
