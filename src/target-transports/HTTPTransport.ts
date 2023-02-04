import axios from 'axios';
import { MessageType } from '../transports/BaseTransport';
import BaseTransport, { ResponseType } from './BaseTransport';


export default class HTTPTransport extends BaseTransport {
  public async sendRequest (message: MessageType): Promise<ResponseType> {
    const result = await axios({
      method: message.method,
      url: `${this._host}:${this._port}${message.path}`,
      headers: message.headers,
      params: message.params,
      data: message.body,
      validateStatus(status) {
        return true;
      },
    });
    return {
      status: result.status,
      headers: result.headers,
      response: result.data,
    };
  }
}
