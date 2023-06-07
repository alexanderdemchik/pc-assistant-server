import 'dotenv/config';
import Koa from 'koa';
import { default as requestLogger } from 'koa-logger';
import json from 'koa-json';
import router from './router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import http from 'http';
import { pubClient, subClient } from './data/redis';
import * as ws from './ws';
import logger from './logger';

const app = new Koa();
const server = http.createServer(app.callback());

ws.init(server);

// Middlewares
app.use(json());

if (process.env.NODE_ENV !== 'production') {
    app.use(requestLogger());
}

app.use(bodyParser());

// Routes
app.use(router.routes()).use(router.allowedMethods());

start();

async function start() {
    const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

    await mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`);

    await pubClient.connect();
    await subClient.connect();

    server.listen(process.env.PORT, async () => {
        logger.info('App successfully started');
    });
}
