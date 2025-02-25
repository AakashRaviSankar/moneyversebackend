import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { TaskLog } from './entities/task-log.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskLog)
        private readonly taskLogRepository: Repository<TaskLog>,
    ) { }

    @Cron('45 * * * * *')
    async handleCron(): Promise<void> {
        const taskName = 'handleCron';
        const maxRetries = 3;
        let attempt = 0;
        let success = false;

        while (attempt < maxRetries && !success) {
            const taskLog = new TaskLog();
            taskLog.taskName = taskName;
            taskLog.attempt = attempt + 1;  // Keep track of the attempt number

            try {
                console.log(`Attempt ${attempt + 1}: Scheduled task running`);

                // Your task logic here, e.g., fetching users, processing data, etc.
                // If the task fails, it should throw an error.

                taskLog.status = 'success';
                success = true;  // Task succeeded, so we stop retrying
            } catch (error) {
                attempt++;
                console.error(`Attempt ${attempt}: Error in scheduled task:`, error);
                taskLog.status = 'failure';

                // Optionally, add a delay before retrying (e.g., wait for 5 seconds before the next attempt)
                if (attempt < maxRetries) {
                    await this.delay(5000); // Wait for 5 seconds before retrying
                }
            } finally {
                // Save the task log to the database
                await this.taskLogRepository.save(taskLog);
            }
        }
    }

    // Helper function to introduce a delay
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
