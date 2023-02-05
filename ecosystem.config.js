module.exports = {
  apps : [{
    name: '',
    script: 'dist/socket-server.js',
    exec_mode: 'cluster',
    max_memory_restart: '400M',
    max_restarts: 250,
    restart_delay: 3000,
  }],
};
