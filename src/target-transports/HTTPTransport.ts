import axios from 'axios';
import { MessageType } from '../transports/BaseTransport';
import type { ResponseType } from './BaseTransport';


export default abstract class BaseTransport {
  private readonly _host: string;
  private readonly _port: string;

  public sendRequest (message: MessageType): Promise<ResponseType> {
    return axios({
      method: message.method,
      url: `${this._host}:${this._port}${message.path}`,
      headers: message.headers,
      data: message.body,
    });
  }
}
