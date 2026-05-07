import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getPublicFileBaseUrl } from '../file/file-storage.config';

@Injectable()
export class FileUrlInterceptor implements NestInterceptor {
  private readonly baseUrl = getPublicFileBaseUrl();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.transform(data)));
  }

  private transform(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((v) => this.transform(v));
    }

    if (
      obj === null ||
      typeof obj !== 'object' ||
      obj instanceof Date ||
      obj instanceof Buffer
    ) {
      return obj;
    }

    const result = { ...obj };

    for (const key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        const value = result[key];

        const isUrlKey = /url|image|photo|cover|avatar/i.test(key);

        if (
          isUrlKey &&
          typeof value === 'string' &&
          value &&
          !value.startsWith('http') &&
          !value.startsWith('data:')
        ) {
          const cleanPath = value.replace(/^\/+/, '').replace(/^covers\//, '');
          result[key] = `${this.baseUrl}/${cleanPath}`;
        } else if (value !== null && typeof value === 'object') {
          result[key] = this.transform(value);
        }
      }
    }

    return result;
  }
}
