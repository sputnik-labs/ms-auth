/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { CreateSessionHandler } from '@modules/session/application/commands/session/create-session.handler';
import { CreateSessionCommand } from '@modules/session/application/commands/session/create-session.command';
import { SessionRepository } from '@modules/session/domain/repositories/session.repository.interface';
import { DEVICE_TYPES } from '@shared/constants/devices';
import { CreateSessionDto } from '@modules/session/application/dtos/session/create-session.dto';
import { Session } from '@modules/session/domain/aggregates/session.aggregate';
import { ApplicationException, Result } from '@inpro-labs/api-sdk';
import { HashModule } from '@shared/infra/security/hash/hash.module';
import { PrismaService } from '@shared/infra/services/prisma.service';
import { SessionFactory } from '@test/factories/fake-session.factory';

describe('CreateSessionHandler', () => {
  let handler: CreateSessionHandler;
  let sessionRepository: MockProxy<SessionRepository>;
  let eventPublisher: MockProxy<EventPublisher>;
  let prisma: PrismaService;

  beforeAll(async () => {
    sessionRepository = mock<SessionRepository>();
    eventPublisher = mock<EventPublisher>();

    eventPublisher.mergeObjectContext.mockImplementation((s) => s);

    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule, HashModule],
      providers: [
        CreateSessionHandler,
        {
          provide: SessionRepository,
          useValue: sessionRepository,
        },
        {
          provide: EventPublisher,
          useValue: eventPublisher,
        },
        PrismaService,
      ],
    }).compile();

    handler = module.get(CreateSessionHandler);
    prisma = module.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.session.deleteMany();
  });

  const validDto: CreateSessionDto = {
    userId: 'user-123',
    device: DEVICE_TYPES.IOS,
    userAgent: 'test-agent',
    ip: '127.0.0.1',
    deviceId: 'test-device-id',
  };

  it('should create a session and call save + commit', async () => {
    jest
      .spyOn(sessionRepository, 'findActiveSessionByDeviceId')
      .mockReturnValueOnce(
        Promise.resolve(
          Result.err(
            new ApplicationException(
              'Session not found',
              404,
              'SESSION_NOT_FOUND',
            ),
          ),
        ),
      );

    const command = new CreateSessionCommand(validDto);
    const session = await handler.execute(command);

    expect(session).toBeInstanceOf(Session);
    expect(session.get('userId').value()).toBe(validDto.userId);

    expect(sessionRepository.save).toHaveBeenCalledWith(session);
    expect(eventPublisher.mergeObjectContext).toHaveBeenCalledTimes(1);
    expect(eventPublisher.mergeObjectContext).toHaveBeenCalledWith(session);
  });

  it('should throw ApplicationException when session creation fails', async () => {
    const session = SessionFactory.make();

    jest
      .spyOn(sessionRepository, 'findActiveSessionByDeviceId')
      .mockReturnValueOnce(Promise.resolve(Result.ok(session.unwrap())));

    const command = new CreateSessionCommand({
      ...validDto,
      device: 'invalid-device',
    });

    await expect(handler.execute(command)).rejects.toThrow(
      ApplicationException,
    );
  });

  it('should throw ApplicationException when session already exists', async () => {
    jest
      .spyOn(sessionRepository, 'findActiveSessionByDeviceId')
      .mockReturnValueOnce(
        Promise.resolve(
          Result.ok(SessionFactory.make('session-EXISTENT-123').unwrap()),
        ),
      );

    const command = new CreateSessionCommand(validDto);

    await expect(handler.execute(command)).rejects.toThrow(
      ApplicationException,
    );
  });
});
