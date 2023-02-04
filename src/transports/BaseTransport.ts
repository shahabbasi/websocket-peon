import BaseWorker from '../databases/workers/BaseWorker';
import BaseCompiler from '../message-compilers/BaseCompiler';
import BaseTargetTransport from '../target-transports/BaseTransport';


export declare type MessageType = {
  method: string
  path: string
  headers: {[key: string]: string}
  params: {[key: string]: string}
  body: {[key: string]: unknown}
}

export default abstract class BaseTransport {
  protected readonly _db: BaseWorker;
  protected _connections: Map<string, unknown>;
  protected readonly _targetTransport: BaseTargetTransport;
  protected readonly _messageCompiler: BaseCompiler;

  constructor (
    db: BaseWorker,
    targetTransport: BaseTargetTransport,
    compiler: BaseCompiler,
  ) {
    this._db = db;
    this._connections = new Map();
    this._targetTransport = targetTransport;
    this._messageCompiler = compiler;
  }

  public abstract initConnection (connection: unknown): string

  protected abstract _publishMessage (connectionId: string, message: string): void
}
