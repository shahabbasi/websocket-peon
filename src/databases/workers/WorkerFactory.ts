import BaseWorker from './BaseWorker';
import RedisWorker from './RedisWorker';
import getRedisConnection from '../connections/redis';


export declare type DatabaseConfigs = {
  dbUrl: string
  dbPrefix: string
}

export enum DatabaseType {
  REDIS = 'redis',
  POSTGRES = 'postgres',
  MONGODB = 'mongodb',
  MYSQL = 'mysql'
}

export default class WorkerFactory {
  private static _getRedisWorker (config: DatabaseConfigs): RedisWorker {
    return new RedisWorker(
      getRedisConnection(config.dbUrl),
      config.dbPrefix,
    );
  }

  public static getWorker (
    dbType: DatabaseType, config: DatabaseConfigs
  ): BaseWorker {
    if (dbType === DatabaseType.REDIS) {
      return this._getRedisWorker(config);
    }
  }
}
