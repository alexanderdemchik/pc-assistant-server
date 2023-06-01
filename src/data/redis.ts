import { createClient } from 'redis';

export const pubClient = createClient({ url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` });
export const subClient = pubClient.duplicate();
