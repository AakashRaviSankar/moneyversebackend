import { Test, TestingModule } from '@nestjs/testing';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { Action } from './entities/action.entity';

describe('ActionsController', () => {
  let controller: ActionsController;
  let service: ActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionsController],
      providers: [
        {
          provide: ActionsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ActionsController>(ActionsController);
    service = module.get<ActionsService>(ActionsService);
  });
});