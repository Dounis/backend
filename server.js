import http from 'http';
import app from './app.js';  // Assure-toi que `app.js` exporte correctement `app` en utilisant `export default app;`

const normalizePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errHandler = error => {
    if (error.syscall !== 'listen') throw error;
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges.`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use.`);
        process.exit(1);
        break;
      default:
        throw error;
    }
};

const server = http.createServer(app);

server.on('error', errHandler);
server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port: ' + port;
    console.log(`Listening on ${bind}`);
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
