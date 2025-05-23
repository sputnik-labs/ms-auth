export interface SessionViewModel {
  id: string;
  device: string;
  userAgent: string;
  ip: string;
  userId: string;
  expiresAt: Date;
  deviceId: string;
  revokedAt: Date | null;
}
