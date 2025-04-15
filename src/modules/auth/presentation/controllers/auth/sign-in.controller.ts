import { CommandBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import {
  MicroserviceRequest,
  MessageResponse,
  ZodValidationPipe,
} from '@inpro-labs/microservices';
import { SignInCommand } from '@modules/auth/application/commands/auth/sign-in.command';
import { SignInEventSchema } from '@modules/auth/presentation/schemas/auth/sign-in-event.schema';
import { SignInDTO } from '@modules/auth/application/dtos/auth/sign-in-command.dto';

@Controller()
export class SignInController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern('sign_in')
  async signIn(
    @Payload(new ZodValidationPipe(SignInEventSchema))
    payload: MicroserviceRequest<SignInDTO>,
  ) {
    const tokens = await this.commandBus.execute(
      new SignInCommand(payload.data),
    );

    return MessageResponse.ok(tokens);
  }
}
