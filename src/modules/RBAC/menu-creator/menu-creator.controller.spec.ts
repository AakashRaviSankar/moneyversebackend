import { Test, TestingModule } from '@nestjs/testing';
import { MenuCreatorController } from './menu-creator.controller';
import { MenuCreatorService } from './menu-creator.service';

describe('MenuCreatorController', () => {
  let controller: MenuCreatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuCreatorController],
      providers: [MenuCreatorService],
    }).compile();

    controller = module.get<MenuCreatorController>(MenuCreatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
