import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  providers: [CoreService],
  exports: [CoreService],
  imports: [PrismaModule],
})
export class CoreModule {}
