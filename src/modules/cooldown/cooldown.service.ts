import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cooldown } from './entities/cooldown.entity';
import { User } from 'modules/users/user/user.entity';

@Injectable()
export class CooldownService {
  private readonly COOLDOWN_TIME = 1 * 60 * 60 * 1000; // 4 hours in milliseconds

  constructor(
    @InjectRepository(Cooldown)
    private readonly cooldownRepo: Repository<Cooldown>,

    @InjectRepository(User) // Inject User repository
    private readonly userRepo: Repository<User>,
  ) {}

  async addNumber(
    userId: string,
    task: string,
    newNumber: number,
  ): Promise<string> {
    const now = Date.now();

    let cooldown = await this.cooldownRepo.findOne({
      where: { user: { id: Number(userId) }, task },
      relations: ['user'],
    });

    // If cooldown exists and has expired, reset numbers and expireAt

    if (!cooldown) {
      // Fetch user and ensure they exist
      const user = await this.userRepo.findOne({
        where: { id: Number(userId) },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Create a new cooldown entry
      cooldown = this.cooldownRepo.create({
        user,
        task,
        numbers: [],
        expireAt: null,
      });
    }

    // If cooldown is active, prevent adding numbers
    if (cooldown.expireAt && cooldown.expireAt > now) {
      throw new BadRequestException(
        'Cooldown active! Please wait until cooldown ends.',
      );
    }

    // Add new number if it's not already present
    if (!cooldown.numbers.includes(newNumber)) {
      cooldown.numbers.push(newNumber);
    }

    // Activate cooldown if numbers reach 10
    if (cooldown.numbers.length >= 10) {
      cooldown.expireAt = now + this.COOLDOWN_TIME;
    }

    // Save the updated cooldown entry
    await this.cooldownRepo.save(cooldown);

    return cooldown.expireAt
      ? 'Cooldown activated! Wait for 4 hours before retrying.'
      : `Number ${newNumber} added successfully! Current: ${cooldown.numbers}`;
  }

  async getCooldownStatus(
    userId: string,
    task: string,
  ): Promise<{ numbers: number[]; cooldownEnds?: number }> {
    const now = Date.now();
    const cooldown = await this.cooldownRepo.findOne({
      where: { user: { id: Number(userId) }, task },
      relations: ['user'],
    });

    if (!cooldown) {
      return { numbers: [], cooldownEnds: undefined };
    }

    if (cooldown.expireAt && cooldown.expireAt <= now) {
      cooldown.numbers = [];
      cooldown.expireAt = null;
      await this.cooldownRepo.save(cooldown);
    }

    return cooldown.expireAt && cooldown.expireAt > now
      ? { numbers: cooldown.numbers, cooldownEnds: cooldown.expireAt }
      : { numbers: cooldown.numbers };
  }
}
