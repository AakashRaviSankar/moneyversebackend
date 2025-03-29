import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../users/user/user.service';
import { JwtService } from '@nestjs/jwt';

import { MESSAGES } from '../../constants/messages.constants';
import { User } from '../users/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { CryptoService } from 'common/modules/services/crypt.service';
import { Wallet } from 'modules/wallet/entities/wallet.entity';
import { MailService } from 'common/modules/services/mail.service';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as crypto from 'crypto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly cryptoService: CryptoService,
    private readonly mailerService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{
    accessToken: string;
    refreshToken?: string;
    roleId: number;
    userId: number;
    mail: string;
  }> {
    try {
      const lowerUserName = username.toLocaleLowerCase();
      console.log(lowerUserName, 'lowerUserName');
      const user = await this.usersService.findOne(lowerUserName, true);
      if (!user) {
        throw new UnauthorizedException(MESSAGES.USER_NOT_FOUND);
      }
      const isPasswordValid = this.cryptoService.verifyPassword(
        pass,
        user?.password,
        user?.salt,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException(MESSAGES.UNAUTHORIZED_ACCESS);
      }
      const payload = { userId: user.id, username: user.username };

      const accessToken = await this.jwtService.signAsync(payload);
      const isRefreshTokenEnable =
        this.configService.get<string>('ISREFRESH_TOKEN');
      const refreshToken =
        isRefreshTokenEnable === 'true'
          ? await this.jwtService.signAsync(payload, {
              expiresIn: this.configService.get<string>(
                'REFRESH_TOKEN_EXPIRES_IN',
              ),
            })
          : null;

      return refreshToken
        ? {
            accessToken,
            refreshToken,
            roleId: user.roleId,
            userId: user.id,
            mail: user.email,
          }
        : {
            accessToken,
            roleId: user.roleId,
            userId: user.id,
            mail: user.email,
          };
    } catch (err) {
      throw err;
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      console.log(payload);
      const newPayload = { userId: payload.userId, username: payload.username };

      const accessToken = await this.jwtService.signAsync(newPayload);
      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException(MESSAGES.INVALID_TOKEN);
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const isUserEmailExist = await this.usersService.findEmail(
        createUserDto.email.toLocaleLowerCase(),
      );

      if (isUserEmailExist) {
        throw new NotFoundException(MESSAGES.USER_EMAIL_ALREADY_EXIST);
      }
      const isUserNameExist = await this.usersService.findOne(
        createUserDto.username.toLocaleLowerCase(),
      );

      if (isUserNameExist) {
        throw new NotFoundException(MESSAGES.USER_ALREADY_EXIST);
      }

      const { hash: hashedPassword, salt } = this.cryptoService.hashPassword(
        createUserDto.password,
      );

      // Create user entity
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        salt: salt,
        roleId: createUserDto.roleId,
      });

      // Save user to get the user ID
      const createdUser = await this.userRepository.save(user);

      // Create wallet for the user
      const wallet = this.walletRepository.create({
        user: createdUser, // Associate the wallet with the created user
      });

      // Save wallet
      const savedWallet = await this.walletRepository.save(wallet);

      // Update user with walletId
      createdUser.wallet = savedWallet;
      await this.userRepository.save(createdUser);

      // Authenticate the user
      const signInRes = await this.signIn(
        createdUser.username,
        createUserDto.password,
      );

      return signInRes;
    } catch (err) {
      throw err;
    }
  }

  // Forgot Password: Generate & Send OTP

  async forgotPassword(email: string): Promise<object> {
    const user = await this.usersService.findEmail(email.toLowerCase());
    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }

    // Generate a secure 6-digit OTP
    const otp = crypto.randomInt(100000, 999999);

    // Generate JWT token with OTP
    const otpToken = this.jwtService.sign(
      { userId: user.id, otp },
      { expiresIn: '5m' }, // Token expires in 5 minutes
    );

    console.log(`DEBUG: OTP generated for user ${user.id}`);
    console.log(`DEBUG: OTP: ${otp}`);
    console.log(`DEBUG: OTP Token: ${otpToken}`);

    // Send OTP via email (Without exposing token in the message)
    await this.mailerService.sendMail2(
      user.email,
      user.username,
      `Your OTP for password reset is: ${otp} , otpToken: ${otpToken}`,
    );

    return { message: 'OTP sent to your email', success: true };
  }

  // Verify OTP
  async verifyOtp(email: string, otp: number, token: string): Promise<object> {
    const user = await this.usersService.findEmail(email.toLowerCase());
    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }

    try {
      // Decode JWT
      const decoded = this.jwtService.verify(token);

      // Validate OTP
      if (decoded.userId !== user.id || decoded.otp !== otp) {
        throw new UnauthorizedException(MESSAGES.INVALID_OTP);
      }

      // Generate a new JWT to authorize password reset (valid for 10 min)
      const resetToken = this.jwtService.sign(
        { userId: user.id, verified: true },
        { expiresIn: '10m' },
      );

      console.log(`DEBUG: OTP verified for user ${user.id}`);

      return { token: resetToken, success: true }; // Send this token back to the user for password reset
    } catch (error) {
      console.error('JWT Verification Error:', error);
      throw new UnauthorizedException(MESSAGES.EXPIRED_OR_INVALID_OTP);
    }
  }

  // Reset Password
  async resetPassword(
    email: string,
    newPassword: string,
    resetToken: string,
  ): Promise<object> {
    const user = await this.usersService.findEmail(email.toLowerCase());
    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }

    try {
      // Verify JWT token for password reset
      const decoded = this.jwtService.verify(resetToken);
      console.log(decoded);

      // Ensure the user is authorized for password reset
      if (decoded.userId !== user.id || !decoded.verified) {
        throw new UnauthorizedException(MESSAGES.UNAUTHORIZED_ACCESS);
      }

      // Securely hash the new password
      const { hash: hashedPassword, salt } =
        this.cryptoService.hashPassword(newPassword);

      // Update the password in the database
      user.password = hashedPassword;
      user.salt = salt;
      await this.userRepository.save(user);

      console.log(`DEBUG: Password reset successful for user ${user.id}`);

      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      console.error('JWT Verification Error:', error);
      throw new UnauthorizedException(MESSAGES.EXPIRED_OR_INVALID_TOKEN);
    }
  }
}
