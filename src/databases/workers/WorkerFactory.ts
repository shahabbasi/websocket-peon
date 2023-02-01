import BaseWorker from './BaseWorker';
import RedisWorker from './RedisWorker';
import getRedisConnection from '../connections/redis';


export declare type DatabaseConfigs = {
  dbUrl: string
  dbPrefix: string
}

export type DatabaseType = 'redis' | 'postgres' | 'mongodb' | 'mysql'

export default class WorkerFactory {
  private static _getRedisWorker (config: DatabaseConfigs): RedisWorker {
    return new RedisWorker(
      getRedisConnection(config.dbUrl),
      config.dbPrefix,
    );
  }

  public static getWorker (
    dbType: string, config: DatabaseConfigs
  ): BaseWorker {
    if (dbType === 'redis') {
      return this._getRedisWorker(config);
    }

    throw new Error('Invalid database type');
  }
}
