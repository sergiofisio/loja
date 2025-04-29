import { Test, TestingModule } from '@nestjs/testing';
import { FreteService } from './frete.service';

describe('FreteService', () => {
  let service: FreteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreteService],
    }).compile();

    service = module.get<FreteService>(FreteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
