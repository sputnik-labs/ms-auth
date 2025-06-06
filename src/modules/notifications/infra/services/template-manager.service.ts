import { NotificationChannel } from '@modules/notifications/domain/enums/notification-channel.enum';
import { Injectable } from '@nestjs/common';
import { userCreatedTemplate } from '../templates/user-created.template';
import { NotificationTemplate } from '@modules/notifications/domain/entities/notification-template.entity';
import { Err, ID, Ok, Result } from '@inpro-labs/core';

export type NotificationTemplateDefinition = {
  id: string;
  name: string;
  description: string;
  channels: {
    type: NotificationChannel;
    metadata: {
      subject: string;
      body: string;
    };
    requiredFields: string[];
  }[];
};

@Injectable()
export class TemplateManagerService {
  private static templates: NotificationTemplate[] = [userCreatedTemplate];

  getTemplate(id: ID): Result<NotificationTemplate, Error> {
    const template = TemplateManagerService.templates.find((template) =>
      template.id.equals(id),
    );

    if (!template) {
      return Err(new Error('Template not found'));
    }

    return Ok(template);
  }
}
