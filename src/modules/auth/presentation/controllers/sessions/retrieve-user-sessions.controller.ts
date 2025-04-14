import { QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { ListUserSessionsDto } from '@modules/auth/application/dtos/session/list-user-sessions.dto';
import { ListUserSessionsQuery } from '@modules/auth/application/queries/session/list-user-sessions.query';
import {
  MicroserviceRequest,
  MessageResponse,
  ZodValidationPipe,
  zodQueryParams,
} from '@inpro-labs/microservices';
import { ListUserSessionsSchema } from '@modules/auth/presentation/schemas/session/list-user-sessions.schema';

@Controller()
export class RetrieveUserSessionsController {
  constructor(private readonly queryBus: QueryBus) {}

  @MessagePattern('list_user_sessions')
  async listUserSessions(
    @Payload(new ZodValidationPipe(zodQueryParams(ListUserSessionsSchema)))
    payload: MicroserviceRequest<ListUserSessionsDto>,
  ) {
    const sessions = await this.queryBus.execute(
      new ListUserSessionsQuery(payload.data),
    );

    return MessageResponse.ok(sessions);
  }
}
