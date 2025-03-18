import { Prisma } from '@prisma/client';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from '../prisma.service';
import { DefaultDelegates } from '../types';

declare type PrismaModelType<T extends Prisma.ModelName> =
  Prisma.TypeMap['model'][T];

declare type PrismaPayloadScalarType<T extends Prisma.ModelName> =
  PrismaModelType<T>['payload']['scalars'];

declare type PrismaOperationType<
  T extends Prisma.ModelName,
  MethodName extends DefaultDelegates,
> = PrismaModelType<T>['operations'][MethodName];

declare type PrismaArgsType<
  T extends Prisma.ModelName,
  MethodName extends DefaultDelegates,
> = PrismaOperationType<T, MethodName>['args'];

export abstract class BaseRepository<T extends Prisma.ModelName> {
  constructor(
    protected prisma: PrismaService,
    protected model: Lowercase<T> | string,
    private txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async create(
    input: PrismaArgsType<T, 'create'>['data'],
    selections?: PrismaArgsType<T, 'create'>['select'],
  ): Promise<PrismaPayloadScalarType<T>> {
    const params = {
      data: input,
      select: selections,
    };
    return await this.txHost.tx[this.model].create(params);
  }

  async findById(
    modelId: number,
    selections?: PrismaArgsType<T, 'findUnique'>['select'],
  ): Promise<PrismaPayloadScalarType<T>> {
    const params = {
      where: {
        id: +modelId,
      },
      select: selections,
    };
    return await (this.prisma as any)[this.model].findUnique(params);
  }

  async findList(
    where?: PrismaArgsType<T, 'findMany'>['where'],
    selections?: PrismaArgsType<T, 'findMany'>['select'],
    orderBy?: PrismaArgsType<T, 'findMany'>['orderBy'],
    pagination?: Record<string, number>,
  ): Promise<PrismaPayloadScalarType<T>[]> {
    if (pagination) {
      return await (this.prisma as any).prismaExtended[this.model]
        .paginate({
          relationLoadStrategy: 'join',
          where,
          orderBy,
          select: selections,
        })
        .withPages({
          limit: pagination.limit,
        });
    } else {
      return await (this.prisma as any)[this.model].findMany({
        where,
        select: selections,
        orderBy,
      });
    }
  }

  async update(
    where: PrismaArgsType<T, 'update'>['where'],
    input: PrismaArgsType<T, 'update'>['data'],
    selections?: PrismaArgsType<T, 'update'>['select'],
  ): Promise<PrismaPayloadScalarType<T>> {
    const params = {
      where,
      data: input,
      select: selections,
    };
    return await this.txHost.tx[this.model].update(params);
  }

  async delete(
    where: PrismaArgsType<T, 'delete'>['where'],
  ): Promise<PrismaPayloadScalarType<T>> {
    const params = {
      where,
    };
    return await this.txHost.tx[this.model].delete(params);
  }

  async deleteMany(
    where: PrismaArgsType<T, 'deleteMany'>['where'],
  ): Promise<PrismaPayloadScalarType<T>[]> {
    const params = {
      where,
    };
    return await this.txHost.tx[this.model].deleteMany(params);
  }

  async createMany(
    inputs: PrismaArgsType<T, 'createMany'>['data'][],
  ): Promise<number> {
    return await this.txHost.tx[this.model].createMany({
      data: inputs,
    });
  }

  async updateMany(
    where: PrismaArgsType<T, 'updateMany'>['where'],
    input: PrismaArgsType<T, 'updateMany'>['data'],
  ): Promise<number> {
    const params = {
      where,
      data: input,
    };
    return await this.txHost.tx[this.model].updateMany(params);
  }

  async upsert(
    input: PrismaArgsType<T, 'upsert'>['create' | 'update'],
    uniqueColumn: Record<string, any>,
    selections?: PrismaArgsType<T, 'upsert'>['select'],
  ): Promise<PrismaPayloadScalarType<T>> {
    const params = {
      where: uniqueColumn,
      create: input,
      update: input,
      select: selections,
    };

    return await this.txHost.tx[this.model].upsert(params);
  }
}
