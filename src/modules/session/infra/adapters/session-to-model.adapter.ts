import { Adapter } from '@sputnik-labs/api-sdk';
import { Session } from '../../domain/aggregates/session.aggregate';
import { SessionModel } from '../../domain/interfaces/session.repository';

export class SessionToModelAdapter implements Adapter<Session, SessionModel> {
  adaptOne(item: Session): SessionModel {
    const {
      id,
      device,
      userAgent,
      ip,
      userId,
      refreshTokenHash,
      expiresAt,
      createdAt,
      revokedAt,
      updatedAt,
    } = item.toObject();

    return {
      id: id.value(),
      device,
      userAgent,
      ip,
      userId: userId.value(),
      refreshTokenHash: refreshTokenHash.get('value'),
      expiresAt,
      createdAt: createdAt,
      revokedAt: revokedAt ?? null,
      updatedAt,
    };
  }

  adaptMany(items: Session[]): SessionModel[] {
    return items.map((item) => this.adaptOne(item));
  }
}
