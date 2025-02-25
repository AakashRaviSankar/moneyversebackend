import { Controller, HttpStatus, Logger } from '@nestjs/common';

@Controller()
export class BaseController {
  protected readonly logger = new Logger(BaseController.name);

  // Common success response logic
  protected formatSuccessResponse(
    data: any,
    statusCode: number,
    message: string = 'Request successful',
  ) {
    return {
      success: true,
      statusCode,
      message,
      data,
    };
  }

  // Common error response logic
  protected formatErrorResponse(
    error: any,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    message: string = 'An error occurred',
  ) {
    this.logger.error(error);
    return {
      success: false,
      statusCode,
      message,
      error: error?.message || error,
    };
  }
}
