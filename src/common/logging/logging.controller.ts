import { Controller, Post, Req, Res, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from './logging.service';

@Controller('logging')
export class LoggingController {
    constructor(private readonly loggingService: LoggingService) { }

    @Post()
    async create(@Req() request: Request, @Res() response: Response, @Body() body: any) {
        try {

            await this.loggingService.log('info', 'LoggingController', 'Request received', JSON.stringify(request.body));


            const resData = { message: 'Success' };
            response.status(200).send(resData);


            await this.loggingService.log('info', 'LoggingController', 'Response sent', JSON.stringify(request.body), JSON.stringify(resData));
        } catch (error) {

            const err = error as any;


            await this.loggingService.log('error', 'LoggingController', err.message, JSON.stringify(request.body), null, err.stack);


            response.status(500).send({ message: 'Internal Server Error' });
        }
    }
}
