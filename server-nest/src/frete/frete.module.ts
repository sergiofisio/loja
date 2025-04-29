import { Module } from '@nestjs/common';
import { FreteService } from './frete.service';

@Module({
  providers: [FreteService],
})
export class FreteModule {}
