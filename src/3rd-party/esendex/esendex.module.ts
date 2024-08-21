import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { EsendexService } from './esendex.service';
import { EsendexController } from './esendex.controller';

@Module({
  imports: [HttpModule],
  controllers: [EsendexController],
  providers: [EsendexService],
  exports: [EsendexService],
})
export class EsendexModule {}
