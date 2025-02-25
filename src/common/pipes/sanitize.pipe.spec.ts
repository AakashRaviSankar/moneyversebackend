// src/common/pipes/sanitize.pipe.spec.ts
import { SanitizePipe } from './sanitize.pipe';

describe('SanitizePipe', () => {
  let pipe: SanitizePipe;

  beforeEach(() => {
    pipe = new SanitizePipe();
  });

  it('should trim string values', () => {
    expect(pipe.transform('  trimmed  ')).toBe('trimmed');
  });

  it('should sanitize object values', () => {
    const obj = { name: '  John  ', age: 30 };
    expect(pipe.transform(obj)).toEqual({ name: 'John', age: 30 });
  });
});
