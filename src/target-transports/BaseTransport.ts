import { MessageType } from '../transports/BaseTransport';


export declare type ResponseType = {
  status: number
  message: string | null
  data: unknown | null
}

export default abstract class BaseTransport {
  private readonly _host: string;
  private readonly _port: string;

  constructor (targetHost: string, targetPort: string) {
    this._host = targetHost;
    this._port = targetPort;
  }

  public abstract sendRequest (message: MessageType): Promise<ResponseType>
}
