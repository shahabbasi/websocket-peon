import { MessageType } from '../transports/BaseTransport';


export declare type ResponseType = {
  status: number
  headers: unknown | null
  data: unknown | null
}

export default abstract class BaseTransport {
  protected readonly _host: string;
  protected readonly _port: string;

  constructor (targetHost: string, targetPort: string) {
    this._host = targetHost;
    this._port = targetPort;
  }

  public abstract sendRequest (message: MessageType): Promise<ResponseType>
}
