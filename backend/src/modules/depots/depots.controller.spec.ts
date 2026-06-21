import { Test, TestingModule } from '@nestjs/testing';
import { DepotsController } from './depots.controller';

describe('DepotsController', () => {
  let controller: DepotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepotsController],
    }).compile();

    controller = module.get<DepotsController>(DepotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
