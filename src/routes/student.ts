import express from 'express';
import { z, ZodError } from 'zod';

import {
  createStudent,
  deleteStudent,
  getStudent,
  getStudents,
  updateStudent
} from '@/models/student';

import type { Request, Response } from 'express';

const router = express.Router();

const StudentSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

const StudentOptionalSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional(),
  birthdate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const students = await getStudents();

    if (!students)
      return res.status(404).json({
        error: 404,
        message: 'A diákok nem találhatóak.'
      });

    return res.json(students);
  } catch (e: unknown) {
    return res.status(500).json({
      error: 500,
      message: 'Internal Server Error'
    });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, birthdate } = await StudentSchema.parseAsync(req.body);

    const r = await createStudent(name, email, birthdate);

    res.status(201).json({
      id: r.insertId,
      name,
      email,
      birthdate
    });
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      const details: Record<string, string> = {};
      e.issues.forEach((issue) => {
        const field = issue.path.join('.');
        details[field] = issue.message;
      });

      return res.status(400).json({
        error: 400,
        message: 'Validation Error',
        details
      });
    }

    throw e;
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const student = await getStudent(id as unknown as number);

    if (!student)
      return res.status(404).json({
        error: 404,
        message: 'A diák nem található.'
      });

    return res.json(student);
  } catch (e: unknown) {
    return res.status(500).json({
      error: 500,
      message: 'Internal Server Error'
    });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { name, email, birthdate } = await StudentOptionalSchema.parseAsync(
      req.body
    );

    await updateStudent(id as unknown as number, name, email, birthdate);
    res.status(204).end();
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      const details: Record<string, string> = {};
      e.issues.forEach((issue) => {
        const field = issue.path.join('.');
        details[field] = issue.message;
      });

      return res.status(400).json({
        error: 400,
        message: 'Validation Error',
        details
      });
    }

    throw e;
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await deleteStudent(id as unknown as number);
    res.status(204).end();
  } catch (e: unknown) {
    if (e instanceof Error) {
      if (e.message.toLowerCase().includes('foreign key constraint'))
        return res.status(409).json({
          error: 409,
          message:
            'Ehhez a diákhoz tartoznak beiratkozások ezért nem lehet kitörölni.'
        });
    }

    return res.status(500).json({
      error: 500,
      message: 'Internal Server Error'
    });
  }
});

export default router;
