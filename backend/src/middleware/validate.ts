import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = result.error.issues || (result.error as any).errors || [];
      return res.status(400).json({
        error: 'Validation error',
        details: issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    req.body = result.data;
    next();
  };
};


