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
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'base.controller';
import { MESSAGES } from 'constants/messages.constants';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
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
  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const data = await this.authService.refreshToken(
      refreshTokenDto.refreshToken,
    );
    return this.formatSuccessResponse(data, HttpStatus.CREATED);
  }
  @Public()
  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
