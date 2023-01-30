import { ConnectionType } from '../connections';
import BaseWorker from './BaseWorker';


export default class RedisWorker extends BaseWorker {
  private readonly prefix: string;
  constructor (
    connection: ConnectionType, prefix: string
  ) {
    super(connection);
    this.prefix = prefix;
  }

  private _createKeyWithIdentity (
    identity: string
  ): string {
    return `${this.prefix}:id:${identity}`;
  }

  private _createKeysWithIdentities (
    identities: Array<string>
  ): Array<string> {
    const keys = [];

    for (const item of identities) {
      keys.push(this._createKeyWithIdentity(item));
    }

    return keys;
  }

  public getUserConnection (
    identity: string
  ): Promise<string> {
    return this.db.get(this._createKeyWithIdentity(identity));
  }

  public getUserConnections (
    identities: Array<string>
  ): Promise<Array<string>> {
    return this.db.mget(this._createKeysWithIdentities(identities));
  }

  public setUserConnection (
    identity: string, connectionId: string
  ): Promise<string> {
    return this.db.set(this._createKeyWithIdentity(identity), connectionId);
  }

  public setUserConnections (
    identities: Array<string>, connectionIds: Array<string>
  ): Promise<string> {
    if (identities.length !== connectionIds.length) {
      throw new Error('Invalid input for identities!');
    }

    const keys = this._createKeysWithIdentities(identities);
    const items: Array<{[key: string]: string}> = [];
    for (let i = 0; i < keys.length; i++) {
      const obj: {[key: string]: string} = {};
      obj[keys[i]] = connectionIds[i];
      items.push(obj);
    }

    return this.db.mset(items);
  }
}
