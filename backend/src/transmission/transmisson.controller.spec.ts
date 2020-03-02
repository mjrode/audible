import { Test, TestingModule } from '@nestjs/testing';
import { TransmissionController } from './transmission.controller';

describe('Transmission Controller', () => {
  let controller: TransmissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransmissionController],
    }).compile();

    controller = module.get<TransmissionController>(TransmissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
