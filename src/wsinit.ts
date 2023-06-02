import { Server } from 'socket.io';
import http from 'http';

export let io: Server;

export function init(server: http.Server) {
    io = new Server(server, { path: '/ws' });
    return io;
}
