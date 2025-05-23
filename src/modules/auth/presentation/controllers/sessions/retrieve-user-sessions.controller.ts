import { QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { ListUserSessionsInputDTO } from '@modules/auth/application/dtos/session/list-user-sessions-input.dto';
import { ListUserSessionsQuery } from '@modules/auth/application/queries/session/list-user-sessions.query';
import {
  MicroserviceRequest,
  MessageResponse,
  ZodValidationPipe,
  zodQueryParams,
} from '@inpro-labs/microservices';
import { listUserSessionsSchema } from '@modules/auth/presentation/schemas/session/list-user-sessions.schema';

@Controller()
export class RetrieveUserSessionsController {
  constructor(private readonly queryBus: QueryBus) {}

  @MessagePattern('list_user_sessions')
  async listUserSessions(
    @Payload(new ZodValidationPipe(zodQueryParams(listUserSessionsSchema)))
    payload: MicroserviceRequest<ListUserSessionsInputDTO>,
  ) {
    const sessions = await this.queryBus.execute(
      new ListUserSessionsQuery(payload.data),
    );

    return MessageResponse.ok(sessions);
  }
}
