# websocket-peon
An applicable layer to your HTTP API which helps you turn it into a WebSocket endpoint


## Configuration and setup
In this section you'll find whatever needed to setup and use this service
#
### Envs
```
NODE_ENV=production # If you don't know what it is, just keep it as is

PORT=3001 # The port that will be exposed


# Target Backend
TARGET_HOST=127.0.0.1 # Target API host

TARGET_PORT=3000 # Target API port


# Database
DATABASE_TYPE=redis # Database type which is Redis by default [redis | postgres | mongodb | mysql]

DB_URL=redis://:@0.0.0.0:6379 # Database connection url

DB_PREFIX=user # Database naming prefixes which will be used to keep the environment separated if you're using a shared database. As for Redis example it will prepend the prefix to all the keys like <DB_PREFIX>:somekey

```
