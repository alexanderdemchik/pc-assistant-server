import Koa from 'koa';
import logger from 'koa-logger';
import json from 'koa-json';
import router from './router';
import dotenv from 'dotenv';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import { authMiddleware } from './auth/auth.middleware';

dotenv.config();

const app = new Koa();

// Middlewares
app.use(json());
app.use(logger());
app.use(bodyParser());

app.use(authMiddleware);

// Routes
app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT, async () => {
    const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

    await mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`);

    console.log('Koa started');
});
