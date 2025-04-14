import { ListUserSessionsSchema } from '@modules/auth/presentation/schemas/session/list-user-sessions.schema';
import { z } from 'zod';
import { QueryParams } from '@inpro-labs/microservices';

export type ListUserSessionsDto = QueryParams<
  z.infer<typeof ListUserSessionsSchema>,
  true
>;
