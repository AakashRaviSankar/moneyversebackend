import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceLog } from './entities/service-log.entity';
import * as winston from 'winston';
import * as path from 'path';

@Injectable()
export class LoggingService {
    constructor(
        @InjectRepository(ServiceLog)
        private readonly serviceLogRepository: Repository<ServiceLog>,
    ) { }

    private createFileLogger(): winston.Logger {
        const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const logFilename = path.join('logs', `error-${currentDate}.log`);

        return winston.createLogger({
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            transports: [
                new winston.transports.File({ filename: logFilename }),
            ],
        });
    }

    async log(
        level: string,
        context: string,
        message: string,
        request?: string,
        response?: string,
        error?: string,
        sqlexception?: string,
        exception?: string,
    ): Promise<void> {
        if (level === "info") {
            response = "success";
        }
        const logEntry = {
            level,
            context,
            message,
            request,
            response,
            error,
            sqlexception,
            exception,
            timestamp: new Date().toISOString(),
        };

        // Log to database
        const dbLog = this.serviceLogRepository.create(logEntry);
        await this.serviceLogRepository.save(dbLog);

        // Log to file only if there is an error
        if (level === 'error' || error || sqlexception || exception) {
            const fileLogger = this.createFileLogger();
            fileLogger.log('error', logEntry);
        }
    }
}
