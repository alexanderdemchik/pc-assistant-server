import 'dotenv/config';
import Koa from 'koa';
import logger from 'koa-logger';
import json from 'koa-json';
import router from './router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import { authMiddleware } from './auth/auth.middleware';
import http from 'http';
import { pubClient, subClient } from './data/redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { Token } from './data/Token';
import { init } from './wsinit';

const app = new Koa();
const server = http.createServer(app.callback());

const io = init(server);

io.adapter(createAdapter(pubClient, subClient));

io.on('connection', async (socket) => {
    const { deviceId, token } = socket.handshake.query;

    try {
        const { userId } = await Token.findOne({ token });
        socket.data = { userId, deviceId };
        socket.join(userId);
    } catch (e) {
        socket.emit('authError', {});
    }
});

// Middlewares
app.use(json());
app.use(logger());
app.use(bodyParser());

app.use(authMiddleware);

// Routes
app.use(router.routes()).use(router.allowedMethods());

start();

async function start() {
    const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

    await mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`);

    await pubClient.connect();
    await subClient.connect();

    server.listen(process.env.PORT, async () => {
        console.log('Koa started');
    });
}
