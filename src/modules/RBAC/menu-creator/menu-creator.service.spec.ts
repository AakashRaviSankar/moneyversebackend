import { Test, TestingModule } from '@nestjs/testing';
import { MenuCreatorService } from './menu-creator.service';

describe('MenuCreatorService', () => {
  let service: MenuCreatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuCreatorService],
    }).compile();

    service = module.get<MenuCreatorService>(MenuCreatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
