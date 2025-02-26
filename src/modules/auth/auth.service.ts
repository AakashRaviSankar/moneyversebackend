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
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{
    accessToken: string;
    refreshToken?: string;
    roleId: number;
    userId: number;
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
        ? { accessToken, refreshToken, roleId: user.roleId, userId: user.id }
        : { accessToken, roleId: user.roleId, userId: user.id };
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
}
