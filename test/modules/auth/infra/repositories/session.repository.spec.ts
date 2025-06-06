import { Test, TestingModule } from '@nestjs/testing';
import { Session } from '@modules/auth/domain/aggregates/session.aggregate';
import { RefreshTokenDigest } from '@modules/auth/domain/value-objects/refresh-token-hash.value-object';
import { DEVICE_TYPES } from '@shared/constants/devices';
import { Combine, ID } from '@inpro-labs/core';
import { User } from '@modules/account/domain/aggregates/user.aggregate';
import { UserFactory } from '@test/factories/fake-user.factory';
import { SessionRepositoryProvider } from '@modules/auth/infra/nest/providers/session-repository.provider';
import { UserRepositoryProvider } from '@modules/account/infra/providers/user-repository.provider';
import { ISessionRepository } from '@modules/auth/domain/interfaces/repositories/session.repository.interface';
import { IUserRepository } from '@modules/account/domain/interfaces/repositories/user.repository.interface';
import { MongooseGateway } from '@shared/gateways/db/mongoose.gateway';
import { sessionSchema } from '@modules/auth/infra/db/schemas/session.schema';
import { PrismaGateway } from '@shared/gateways/db/prisma.gateway';

describe('SessionRepository (integration)', () => {
  if (!process.env.DATABASE_URL?.includes('inpro_test')) {
    throw new Error('⚠️ Unsafe environment detected for integration tests!');
  }

  let repository: ISessionRepository;
  let mongoose: MongooseGateway;
  let userRepository: IUserRepository;
  let user: User;
  let session: Session;

  const createValidSession = () => {
    const [id, refreshTokenDigest] = Combine([
      ID.create('1'),
      RefreshTokenDigest.create('hash'),
    ]).unwrap();

    return Session.create({
      id,
      userId: user.id,
      refreshTokenDigest,
      device: DEVICE_TYPES.IOS,
      userAgent: 'agent',
      ip: '127.0.0.1',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 86400000),
      updatedAt: new Date(),
      deviceId: 'test-device-id',
    }).unwrap();
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseGateway.withSchemas({
          name: 'Session',
          schema: sessionSchema,
        }),
      ],
      providers: [
        PrismaGateway,
        SessionRepositoryProvider,
        UserRepositoryProvider,
      ],
    }).compile();

    mongoose = module.get(MongooseGateway);
    repository = module.get(ISessionRepository);
    userRepository = module.get(IUserRepository);

    user = UserFactory.make();

    await userRepository.save(user);

    session = createValidSession();
  });

  beforeEach(async () => {
    await mongoose.models.Session.deleteMany();
  });

  afterAll(async () => {
    await mongoose.models.User.deleteMany();
    await mongoose.getConnection().close();
  });

  beforeEach(async () => {
    session = createValidSession();
    await repository.save(session);
  });

  it('should save and retrieve session by ID', async () => {
    const found = await repository.findById(session.id.value());
    console.log(found);

    expect(found.isOk()).toBe(true);
    expect(found.unwrap().id.equals(session.id)).toBe(true);
  });

  it('should find active session by device ID and user ID', async () => {
    const found = await repository.findActiveSession(
      session.get('deviceId'),
      session.get('userId').value(),
    );

    expect(found.isOk()).toBe(true);
  });
});
