import Redis from 'ioredis';


let redis: Redis | null = null;

export default function (url: string): Redis {
  if (!redis) redis = new Redis(url);
  return redis;
}
