import BaseTransport, { MessageType } from './BaseTransport';
import uuid from '../utils/uuid';
import type { WebSocket } from 'ws';
import type { ResponseType } from '../target-transports/BaseTransport';


export default abstract class WebSocketTransport extends BaseTransport {
  protected readonly _connections: { [key: string]: WebSocket; };
  public initConnection (connection: WebSocket): string {
    const id = uuid();
    this._connections[id] = connection;
    return id;
  }

  public deliverMessage (
    connectionId: string, message: MessageType
  ): Promise<ResponseType> {
    const conn = this._connections[connectionId];
    if (conn && conn.readyState === conn.OPEN) {
      return this._targetTransport.sendRequest(message);
    }
  }
}
