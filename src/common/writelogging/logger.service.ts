import { Injectable } from '@nestjs/common';
import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';

@Injectable()
export class LoggerService {
  private logDirPath: string = resolve(__dirname, 'logs');
  private logFilePath: string = join(this.logDirPath, 'application.log');

  constructor() {
    // Ensure the log directory exists
    if (!existsSync(this.logDirPath)) {
      mkdirSync(this.logDirPath, { recursive: true });
    }
    // Create or clear the log file
    writeFileSync(this.logFilePath, '', { flag: 'w' });
  }

  log(message: string): void {
    this.appendToFile(`[LOG] ${new Date().toISOString()}: ${message}`);
  }

  error(message: string): void {
    this.appendToFile(`[ERROR] ${new Date().toISOString()}: ${message}`);
  }

  private appendToFile(message: string): void {
    appendFileSync(this.logFilePath, message + '\n', { encoding: 'utf8' });
  }
}
