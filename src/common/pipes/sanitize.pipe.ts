import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') {
      return value.trim();
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.transform(item)); // Recursively sanitize arrays
    }

    if (typeof value === 'object' && value !== null) {
      return this.sanitizeObject(value);
    }

    return value; // Return non-string and non-object values as is
  }

  private sanitizeObject(obj: any): any {
    const sanitizedObj: any = {};
    for (const key of Object.keys(obj)) {
      if (Array.isArray(obj[key])) {
        sanitizedObj[key] = obj[key].map((item) => this.transform(item)); // Handle nested arrays
      } else {
        sanitizedObj[key] =
          typeof obj[key] === 'string' ? obj[key].trim() : obj[key];
      }
    }
    return sanitizedObj;
  }
}
