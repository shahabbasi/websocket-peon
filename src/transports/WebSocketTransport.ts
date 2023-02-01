import BaseTransport, { MessageType } from './BaseTransport';
import uuid from '../utils/uuid';
import { WebSocket } from 'ws';
import BaseTargetTransport, { ResponseType } from '../target-transports/BaseTransport';
import BaseWorker from '../databases/workers/BaseWorker';


export default abstract class WebSocketTransport extends BaseTransport {
  protected readonly _connections: Map<string, WebSocket> = new Map();

  constructor(
    db: BaseWorker, targetTransport: BaseTargetTransport
  ) {
    super(db, targetTransport);
    this._setupConnectivityChecker();
  }

  public initConnection (connection: WebSocket): string {
    const id = uuid();
    this._connections.set(id, connection);
    return id;
  }

  public deliverMessage (
    connectionId: string, message: MessageType
  ): Promise<ResponseType> {
    const conn = this._connections.get(connectionId);
    if (conn && conn.readyState === conn.OPEN) {
      return this._targetTransport.sendRequest(message);
    }
  }

  private _checkConnectivity (connectionId: string): void {
    if (this._connections.has(connectionId)) {
      const connection = this._connections.get(connectionId);
      if (connection.readyState === WebSocket.CLOSED) {
        this._connections.delete(connectionId);
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
}
