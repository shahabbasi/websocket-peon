import axios from 'axios';
import { MessageType } from '../transports/BaseTransport';
import BaseTransport, { ResponseType } from './BaseTransport';


export default class HTTPTransport extends BaseTransport {
  public sendRequest (message: MessageType): Promise<ResponseType> {
    return axios({
      method: message.method,
      url: `${this._host}:${this._port}${message.path}`,
      headers: message.headers,
      data: message.body,
    });
  }
}
