import express from 'express';
import { z, ZodError } from 'zod';

import {
  createCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse
} from '@/models/course';

import type { Request, Response } from 'express';

const router = express.Router();

const CourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default('')
});

const CourseOptionalSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional()
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const courses = await getCourses();

    if (!courses)
      return res.status(404).json({
        error: 404,
        message: 'A tantárgyak nem találhatóak.'
      });

    return res.json(courses);
  } catch {
    return res.status(500).json({
      error: 500,
      message: 'Internal Server Error'
    });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description } = await CourseSchema.parseAsync(req.body);

    const r = await createCourse(title, description);

    res.status(201).json({
      id: r.insertId,
      title,
      description
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
    const course = await getCourse(id as unknown as number);

    if (!course)
      return res.status(404).json({
        error: 404,
        message: 'A tantárgy nem található.'
      });

    return res.json(course);
  } catch {
    return res.status(500).json({
      error: 500,
      message: 'Internal Server Error'
    });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { title, description } = await CourseOptionalSchema.parseAsync(
      req.body
    );

    await updateCourse(id as unknown as number, title, description);
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
    await deleteCourse(id as unknown as number);
    res.status(204).end();
  } catch (e: unknown) {
    if (e instanceof Error) {
      if (e.message.toLowerCase().includes('foreign key constraint'))
        return res.status(409).json({
          error: 409,
          message:
            'Ehhez a tantárgyhoz tartoznak beiratkozások ezért nem lehet kitörölni.'
        });
    }

    return res.status(500).json({
      error: 500,
      message: 'Internal Server Error'
    });
  }
});

export default router;
