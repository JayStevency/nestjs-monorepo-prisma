import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { pagination } from 'prisma-extension-pagination';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    super({
      log: [
        {
          emit: configService.get('prismaLogger'),
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
      datasources: {
        db: {
          url: configService.get('databaseUrl'),
        },
      },
    });
    this.prismaExtended = this.$extends(pagination());
  }

  async onModuleInit() {
    await this.$connect();
  }
  public readonly prismaExtended;
}
