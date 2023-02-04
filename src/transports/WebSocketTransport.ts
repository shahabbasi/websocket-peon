import BaseTransport, { MessageType } from './BaseTransport';
import uuid from '../utils/uuid';
import { WebSocket } from 'ws';
import BaseTargetTransport, { ResponseType } from '../target-transports/BaseTransport';
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
      if (msgData.messageType === 'request') {
        if (typeof msgData.data !== 'string') {
          const result = await this._sendToTarget(msgData.data);
          this._publishMessage(connectionId, JSON.stringify(result));
          return;
        }
      } else if (msgData.messageType === 'action') {
        if (typeof msgData.data === 'string') {
          this._registerUser(connectionId, msgData.data);
          return;
        }
      }
      this._publishMessage(connectionId, JSON.stringify({
        status: 422,
        message: 'Invalid message format!',
      }));
    } catch (error) {
      this._publishMessage(connectionId, JSON.stringify({
        status: 422,
        message: 'Invalid message format!',
      }));
    }
  }

  private async _sendToTarget (
    msgData: MessageType,
  ): Promise<ResponseType> {
    const result = await this._targetTransport.sendRequest(msgData);
    return result;
  }

  private async _registerUser (
    connectionId: string,
    msgData: string,
  ): Promise<void> {
    this._db.setUserConnection(msgData, connectionId);
    this._publishMessage(
      connectionId,
      JSON.stringify({
        status: 200,
        message: 'You\'ve been registered!',
      }),
    );
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
