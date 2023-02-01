import BaseWorker from '../databases/workers/BaseWorker';
import BaseTargetTransport from '../target-transports/BaseTransport';


export declare type MessageType = {
  method: string
  path: string
  headers: {[key: string]: string}
  body: {[key: string]: unknown}
}

export default abstract class BaseTransport {
  protected readonly _db: BaseWorker;
  protected _connections: Map<string, unknown>;
  protected readonly _targetTransport: BaseTargetTransport;

  constructor (db: BaseWorker, targetTransport: BaseTargetTransport) {
    this._db = db;
    this._connections = new Map();
    this._targetTransport = targetTransport;
  }

  public abstract initConnection (connection: unknown): string

  public abstract deliverMessage (connectionId: string, message: MessageType): void
}
