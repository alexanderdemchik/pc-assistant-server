import { createClient } from 'redis';

export const pubClient = createClient();
export const subClient = pubClient.duplicate();
