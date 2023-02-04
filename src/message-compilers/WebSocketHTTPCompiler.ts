import { MessageType } from '../transports/BaseTransport';
import BaseCompiler from './BaseCompiler';


export default class WebSocketHTTPCompiler extends BaseCompiler {
  constructor (messageSchema: string) {
    super(messageSchema);
  }

  public compileMessage (message: Buffer): MessageType {
    const msgData = JSON.parse(message.toString());

    if (this._validate(msgData)[0]) {
      const headers = {};
      for (const header of msgData.headers) {
        headers[header.key] = header.value;
      }

      const params = {};
      for (const param of msgData.params) {
        params[param.key] = param.value;
      }

      const msg = {
        method: msgData.method,
        path: msgData.path,
        headers: headers,
        params: params,
        body: msgData.body,
      };

      return msg;
    }

    throw new Error('Invalid message format');
  }
}
