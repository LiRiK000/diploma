import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class FileUrlInterceptor implements NestInterceptor {
  private readonly s3PublicUrl = process.env.S3_PUBLIC_URL?.replace(/\/$/, '');
  private readonly bucket = process.env.S3_BUCKET || 'covers';

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.transform(data)));
  }

  private transform(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((v) => this.transform(v));
    }

    if (obj !== null && typeof obj === 'object') {
      const result = { ...obj };

      Object.keys(result).forEach((key) => {
        const value = result[key];

        const isUrlKey = /url|image|photo|cover|avatar/i.test(key);

        if (
          isUrlKey &&
          typeof value === 'string' &&
          value &&
          !value.startsWith('http')
        ) {
          const cleanPath = value.replace(/^\//, '');

          if (cleanPath.startsWith(`${this.bucket}/`)) {
            result[key] = `${this.s3PublicUrl}/${cleanPath}`;
          } else {
            result[key] = `${this.s3PublicUrl}/${this.bucket}/${cleanPath}`;
          }
        } else if (value !== null && typeof value === 'object') {
          result[key] = this.transform(value);
        }
      });
      return result;
    }

    return obj;
  }
}
