import BaseTransport from './BaseTransport';
import uuid from '../utils/uuid';
import { WebSocket } from 'ws';
import BaseTargetTransport from '../target-transports/BaseTransport';
import BaseWorker from '../databases/workers/BaseWorker';
import WebSocketHTTPCompiler from '../message-compilers/WebSocketHTTPCompiler';


export default class WebSocketTransport extends BaseTransport {
  protected readonly _connections: Map<string, WebSocket> = new Map();

  constructor(
    db: BaseWorker,
    targetTransport: BaseTargetTransport,
    compiler: WebSocketHTTPCompiler,
  ) {
    super(db, targetTransport, compiler);
    this._setupConnectivityChecker();
  }

  public initConnection (connection: WebSocket): string {
    const id = uuid();
    connection['isAlive'] = true;
    this._connections.set(id, connection);
    return id;
  }

  public handlePong (connectionId: string): void {
    this._refreshConnection(connectionId);
  }

  public async handleUserMessage (
    connectionId: string,
    message: Buffer,
  ): Promise<void> {
    try {
      const msgData = this._messageCompiler.compileMessage(message);
      const result = await this._targetTransport.sendRequest(msgData);
      this._publishMessage(connectionId, JSON.stringify(result));
    } catch (error) {
      console.log(error);

      this._publishMessage(connectionId, JSON.stringify({
        status: 422,
        message: 'Invalid message format!',
      }));
    }
  }

  private _refreshConnection (connectionId: string): void {
    const connection = this._connections.get(connectionId);
    if (connection) connection['isAlive'] = true;
  }

  private _checkConnectivity (connectionId: string): void {
    if (this._connections.has(connectionId)) {
      const connection = this._connections.get(connectionId);
      if (connection['isAlive'] === false) {
        connection.terminate();
        this._connections.delete(connectionId);
      } else {
        connection['isAlive'] = false;
        connection.ping();
      }
    }
  }

  private _setupConnectivityChecker (): void {
    setInterval (() => {
      for (const key of this._connections.keys()) {
        this._checkConnectivity(key);
      }
    }, 2 * 60 * 1000);
  }

  protected _publishMessage (
    connectionId: string, message: string
  ): void {
    const conn = this._connections.get(connectionId);
    if (conn && conn.readyState === conn.OPEN) {
      conn.send(message);
    }
  }
}
