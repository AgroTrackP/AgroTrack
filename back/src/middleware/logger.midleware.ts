import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(
      `Ejecutando metodo ${req.method} en la ruta ${req.originalUrl} en la fecha ${new Date().toLocaleString()}`,
    );
    next();
  }
}
export function loggerGlobal(req: Request, res: Response, next: NextFunction) {
  console.log(
    `Ejecutando metodo ${req.method} en la ruta ${req.url} en la fecha ${new Date().toLocaleString()}`,
  );
  next();
}
