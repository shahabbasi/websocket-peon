import 'dotenv/config';
import Fastify from 'fastify';
import RedisBrokerWorker from './brokers/RedisBrokerWorker';


async function init () {
  const broker = new RedisBrokerWorker(
    process.env.DB_URL,
    process.env.DB_PREFIX,
  );

  const fastify = Fastify({
    logger: true,
  });

  // Declare a route
  fastify.post('/publish', {
    schema: {
      body: {
        type: 'object',
        properties: {
          messageType: {
            type: 'string',
          },
          userIdentities: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          message: { },
        },
      },
    },
  }, function (request, reply) {
    broker.publishMessage(JSON.stringify(request.body));
    reply.send();
  });

  const port = 3002;
  // Run the server!
  fastify.listen({ port: port }, function (err, address) {
    fastify.log.info(`Server running on port ${port}`);
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    // Server is now listening on ${address}
  });
}

(async function () {
  await init();
})();
