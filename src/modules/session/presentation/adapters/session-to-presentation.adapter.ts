import { Session } from '@modules/session/domain/aggregates/session.aggregate';
import { Adapter } from '@sputnik-labs/api-sdk';
import { SessionViewModel } from '../view-model/session.view-model';

export class SessionToPresentationAdapter
  implements Adapter<Session, SessionViewModel>
{
  adaptOne(session: Session): SessionViewModel {
    const { id, device, userAgent, ip, userId, refreshTokenHash, expiresAt } =
      session.toObject();

    return {
      id: id!.value(),
      device,
      userAgent,
      ip,
      userId: userId.value(),
      refreshTokenHash: refreshTokenHash.get('value'),
      expiresAt,
    };
  }

  adaptMany(sessions: Session[]): SessionViewModel[] {
    return sessions.map((session) => this.adaptOne(session));
  }
}
