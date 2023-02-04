import { Validator, ValidatorResult } from 'jsonschema';
import { MessageType } from '../transports/BaseTransport';


export default class BaseCompiler {
  protected readonly _schema: {[key: string]: unknown};
  protected readonly _validator: Validator;

  constructor (messageSchema: string) {
    this._schema = JSON.parse(messageSchema);
    this._validator = new Validator();
  }

  protected _validate (
    data: {[key: string]: unknown}
  ): [boolean, ValidatorResult] {
    const validate = this._validator.validate(data, this._schema);
    return [validate.valid, validate];
  }

  public compileMessage (message: unknown): MessageType {
    throw new Error('Not implemented!');
  }
}
