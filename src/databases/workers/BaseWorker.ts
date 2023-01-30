import Redis from 'ioredis';
import type { ConnectionType } from '../connections/index';

export default abstract class BaseWorker {
  protected readonly db: Redis;

  constructor (connection: ConnectionType) {
    this.db = connection;
  }

  public abstract getUserConnection (
    identity: string
  ): Promise<string>

  public abstract setUserConnection (
    identity: string, connectionId: string
  ): Promise<string>

  public abstract setUserConnections (
    identities: Array<string>, connectionIds: Array<string>
  ): Promise<string>
}
