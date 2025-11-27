import express from 'express';
import { z, ZodError } from 'zod';

import {
  createEnrollment,
  deleteEnrollment,
  getEnrollment,
  getEnrollments,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse
} from '@/models/enrollment';

import type { Request, Response } from 'express';

const router = express.Router();

const EnrollmentSchema = z.object({
  student_id: z.number().int().positive(),
  course_id: z.number().int().positive()
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const enrollments = await getEnrollments();

    if (!enrollments)
      return res.status(404).json({
        error: 404,
        message: 'A beiratkozások nem találhatóak.'
      });

    return res.json(enrollments);
  } catch {
    return res.status(500).json({
      error: 500,
      message: 'Internal Server Error'
    });
  }
});

router.get('/student/:student_id', async (req: Request, res: Response) => {
  const { student_id } = req.params;

  try {
    const enrollments = await getEnrollmentsByStudent(
      parseInt(student_id as string)
    );

    if (!enrollments)
      return res.status(404).json({
        error: 404,
        message: 'A beiratkozások nem találhatóak.'
      });

    return res.json(enrollments);
  } catch {
    return res.status(500).json({
      error: 500,
      message: 'Internal Server Error'
    });
  }
});

router.get('/course/:course_id', async (req: Request, res: Response) => {
  const { course_id } = req.params;

  try {
    const enrollments = await getEnrollmentsByCourse(
      parseInt(course_id as string)
    );

    if (!enrollments)
      return res.status(404).json({
        error: 404,
        message: 'A beiratkozások nem találhatóak.'
      });

    return res.json(enrollments);
  } catch {
    return res.status(500).json({
      error: 500,
      message: 'Internal Server Error'
    });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { student_id, course_id } = await EnrollmentSchema.parseAsync(
      req.body
    );

    const r = await createEnrollment(student_id, course_id);

    res.status(201).json({
      id: r.insertId,
      student_id,
      course_id
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

    if (e instanceof Error) {
      if (e.message.toLowerCase().includes('foreign key constraint'))
        return res.status(400).json({
          error: 400,
          message: 'Érvénytelen diák vagy tantárgy azonosító.'
        });
    }

    throw e;
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const enrollment = await getEnrollment(id as unknown as number);

    if (!enrollment)
      return res.status(404).json({
        error: 404,
        message: 'A beiratkozás nem található.'
      });

    return res.json(enrollment);
  } catch {
    return res.status(500).json({
      error: 500,
      message: 'Internal Server Error'
    });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await deleteEnrollment(id as unknown as number);
    res.status(204).end();
  } catch {
    return res.status(500).json({
      error: 500,
      message: 'Internal Server Error'
    });
  }
});

export default router;
