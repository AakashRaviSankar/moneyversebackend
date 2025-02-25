import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CooldownService } from './cooldown.service';
import { CooldownController } from './cooldown.controller';
import { Cooldown } from './entities/cooldown.entity';
import { User } from 'modules/users/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cooldown, User])],
  controllers: [CooldownController],
  providers: [CooldownService],
  exports: [CooldownService],
})
export class CooldownModule {}
