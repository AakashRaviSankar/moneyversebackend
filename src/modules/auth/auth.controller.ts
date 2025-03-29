import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'base.controller';
import { MESSAGES } from 'constants/messages.constants';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('v1/auth')
@ApiTags('Auth')
export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }

  @Public()
  @Post('login')
  @ApiBody({ description: 'User login', type: SignInDto })
  async signIn(@Body() signInDto: SignInDto) {
    console.log('login');
    const data = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    console.log(data, 'hug');
    return this.formatSuccessResponse(
      data,
      HttpStatus.CREATED,
      MESSAGES.LOGGED_IN_SUCCESSFULLY,
    );
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<object> {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  // Step 2: Verify OTP
  @Public()
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<object> {
    return this.authService.verifyOtp(
      verifyOtpDto.email,
      +verifyOtpDto.otp,
      verifyOtpDto.token,
    );
  }

  // Step 3: Reset Password
  @Public()
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<object> {
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.newPassword,
      resetPasswordDto.token,
    );
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
