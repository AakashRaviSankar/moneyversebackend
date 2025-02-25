import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    // Customize your error handling logic here
    const response = context.switchToHttp().getResponse();

    response.status(429).json({
      statusCode: 429,
      message:
        'You have exceeded the number of allowed requests. Please try again later.',
      timestamp: new Date().toISOString(),
    });
  }
}
