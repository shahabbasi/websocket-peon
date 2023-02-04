'use strict';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import WebSocketTransport from './transports/WebSocketTransport';
import WorkerFactory from './databases/workers/WorkerFactory';
import BaseWorker from './databases/workers/BaseWorker';
import BaseTargetTransport from './target-transports/BaseTransport';
import HTTPTransport from './target-transports/HTTPTransport';
import WebSocketHTTPCompiler from './message-compilers/WebSocketHTTPCompiler';


async function init(): Promise<void> {
  const dbType: string = process.env.DATABASE_TYPE;

  const worker: BaseWorker = WorkerFactory.getWorker(
    dbType,
    {
      dbUrl: process.env.DB_URL,
      dbPrefix: process.env.DB_PREFIX,
    }
  );

  const targetTransport: BaseTargetTransport = new HTTPTransport(
    process.env.TARGET_HOST,
    process.env.TARGET_PORT,
  );

  const messageCompiler: WebSocketHTTPCompiler = new WebSocketHTTPCompiler(
    fs.readFileSync(
      path.normalize(
        './src/schemas/ws-http/validation-schema.json'
      ),
      {encoding: 'utf-8'}
    )
  );

  const transport = new WebSocketTransport(
    worker,
    targetTransport,
    messageCompiler,
  );

  const port = parseInt(process.env.PORT || '3001');
  const server = new WebSocketServer({
    port: port,
  });

  server.on('connection', function connection(ws: WebSocket) {
    const connectionId: string = transport.initConnection(ws);

    ws.on('message', function message(data: Buffer) {
      transport.handleUserMessage(connectionId, data);
    });

    ws.on('pong', function () {
      transport.handlePong(connectionId);
    });

    ws.on('error', (err) => {
      // TODO: Setup error logger!
    });

    ws.on('close', function close() {
      // TODO: Setup close handler!
    });

    ws.on('ping', () => {
      ws.pong();
    });

    if (ws.readyState in [WebSocket.OPEN, WebSocket.CONNECTING]) {
      ws.send(JSON.stringify({ message: `Your connectionId is: ${connectionId}` }));
    }
  });

  server.on('close', function close() {
    // TODO: Shutdown server!
  });

  server.once('listening', () => {
    console.log(`Server started listening on port: ${port}`);
  });
}

(async () => {
  await init();
})();
