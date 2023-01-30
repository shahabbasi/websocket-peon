import dotenv from 'dotenv';
import Fastify from 'fastify';


dotenv.config();

const server = Fastify({
  logger: true,
});

server.listen({ port: parseInt(process.env.PORT || '3000') }, function (err, address) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`Server listening on ${address}:${process.env.PORT}`);
});
