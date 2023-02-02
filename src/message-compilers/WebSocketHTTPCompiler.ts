import BaseCompiler from './BaseCompiler';


export default class WebSocketHTTPCompiler extends BaseCompiler {
  constructor (messageSchema: string) {
    super(messageSchema);
  }
}
