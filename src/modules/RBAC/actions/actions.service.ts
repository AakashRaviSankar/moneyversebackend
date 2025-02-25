import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action } from './entities/action.entity';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
  ) {}

  create(createActionDto: CreateActionDto): Promise<Action> {
    const action = this.actionRepository.create(createActionDto);
    return this.actionRepository.save(action);
  }

  findAll(): Promise<Action[]> {
    return this.actionRepository.find();
  }

  findOne(id: number): Promise<Action> {
    return this.actionRepository.findOneBy({ id });
  }

  async update(id: number, updateActionDto: UpdateActionDto): Promise<Action> {
    await this.actionRepository.update(id, updateActionDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.actionRepository.delete(id);
  }
}
