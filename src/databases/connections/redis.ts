import Redis from 'ioredis';


let redis: Redis | null = null;

export default function (url: string, getNew = false): Redis {
  if (getNew) return new Redis(url);
  if (!redis) redis = new Redis(url);
  return redis;
}
