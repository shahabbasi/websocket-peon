import 'dotenv/config';
import { WebSocketServer, WebSocket } from 'ws';


async function init(): Promise<void> {
  const server = new WebSocketServer({
    port: parseInt(process.env.PORT || '3001'),
  });

  server.on('connection', function connection(ws: WebSocket) {
    const id = v4();
    socketManager.connect(id, ws);

    ws.on('message', function message(data) {
      const [status, answer] = socketManager.resolveUserMessage(id, data.toString());
      if (status === 200 && answer) ws.send(`S${200}${answer}`);
      if (status !== 200) ws.send(`E${status}${answer}`);
    });

    ws.on('pong', function () {
      socketManager.refreshConnection(id);
    });

    ws.on('error', (err) => {
      logger.error(err);
    });

    ws.on('close', function close() {
      socketManager.disconnect(id);
    });
  });

  server.on('close', function close() {
    socketManager.serverClose();
  });

}

(async () => {
  await init();
})();
