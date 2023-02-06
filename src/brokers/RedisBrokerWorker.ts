import { ConnectionType } from '../databases/connections';
import getRedisConnection from '../databases/connections/redis';


export declare type OnMessageHandler = (channel: string, message: string) => void

export default class RedisBrokerWorker {
  private readonly _channel: string;
  private readonly _redis: ConnectionType;
  constructor (
    redisUrl: string, prefix: string
  ) {
    this._redis = getRedisConnection(redisUrl, true);
    this._channel = `${prefix}-target-backend-events`;
  }

  public startListen (onMessage: OnMessageHandler): void {
    this._redis.subscribe(this._channel, (err, count) => {
      if (err) {
        console.error('Failed to subscribe: %s', err.message);
      } else {
        console.log(
          `Subscribed successfully! This client is currently subscribed to ${count} channels.`
        );
      }
    });

    this._redis.on('message', onMessage);
  }

  public publishMessage (message: string): void {
    this._redis.publish(this._channel, message);
  }
}
