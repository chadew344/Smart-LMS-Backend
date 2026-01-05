import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

export const validate = (schema: ZodObject<any>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      next(err);
    }
  };
};
