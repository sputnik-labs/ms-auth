import { Session } from '@modules/auth/domain/aggregates/session.aggregate';
import { RefreshTokenDigest } from '@modules/auth/domain/value-objects/refresh-token-hash.value-object';
import { ID, Result } from '@inpro-labs/core';

type SessionFactoryParams = {
  id?: string;
  userId?: string;
  refreshTokenDigest?: string;
  device?: string;
  deviceId?: string;
  userAgent?: string;
  ip?: string;
  expiresAt?: Date;
  revokedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  lastRefreshAt?: Date;
};

export class SessionFactory {
  static make({
    id,
    userId,
    refreshTokenDigest,
    device,
    deviceId,
    userAgent,
    ip,
    expiresAt,
    revokedAt,
    createdAt,
    updatedAt,
  }: SessionFactoryParams = {}): Result<Session> {
    return Session.create({
      id: ID.create(id ?? 'session-123').unwrap(),
      userId: ID.create(userId ?? 'user-123').unwrap(),
      refreshTokenDigest: RefreshTokenDigest.create(
        refreshTokenDigest ?? 'refresh-token-digest',
      ).unwrap(),
      device: device ?? Session.deviceTypes[0],
      deviceId: deviceId ?? 'device-id',
      userAgent: userAgent ?? 'user-agent',
      ip: ip ?? 'ip',
      createdAt: createdAt ?? new Date(),
      updatedAt: updatedAt ?? new Date(),
      expiresAt: expiresAt ?? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      revokedAt: revokedAt ?? undefined,
    });
  }
}
