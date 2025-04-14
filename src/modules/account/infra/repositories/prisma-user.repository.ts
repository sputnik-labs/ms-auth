import { PrismaService } from '@shared/infra/services/prisma.service';
import { UserRepository } from '@modules/account/domain/repositories/user.repository';
import { User } from '@modules/account/domain/aggregates/user.aggregate';
import { UserToModelAdapter } from '@modules/account/infra/adapters/user/user-to-model.adapter';
import { Err, Ok, Result } from '@inpro-labs/core';
import { UserToDomainAdapter } from '@modules/account/infra/factories/user.factory';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<Result<User>> {
    const userModel = user.toObject(new UserToModelAdapter());

    try {
      await this.prisma.user.upsert({
        where: { id: userModel.id },
        update: userModel,
        create: userModel,
      });

      return Ok(user);
    } catch (error) {
      console.log(error);
      return Err(error);
    }
  }

  async findByEmail(email: string): Promise<Result<User>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return Err(new Error('User not found'));
      }

      const userDomain = new UserToDomainAdapter().adaptOne(user);

      return Ok(userDomain);
    } catch (error) {
      return Err(error);
    }
  }
}
