import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.excludePassword(data)));
  }
  private excludePassword(data: any): unknown {
    if (!data) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.excludePassword(item));
    }

    if (typeof data === 'object') {
      if ('user' in data) {
        return {
          ...data,
          user: this.excludePassword(data.user),
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = data;
      return rest;
    }

    return data;
  }
}
