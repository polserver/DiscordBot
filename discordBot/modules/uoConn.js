const net    = require('net');
const config = require('../config');
// function polString(str) {
//   return `s${str}`;
// }

function uoConn() {
  const client = net.createConnection({ port: config.auxServicePort, host: config.shardIP });

  // Handles errors and connection timeouts
  client.on('error', (err) => {
    if (err.code === 'ETIMEDOUT' || err.code === 'EHOSTDOWN' || err.code === 'ECONNREFUSED') {
      console.log('[ERROR] Connection refused! Please check the IP.');
      client.setTimeout(8000, () => {
        client.connect(config.auxServicePort, config.shardIP);
      });
      return;
    }
    if (err.message.includes('Cannot call write after a stream was destroyed')) return;
    console.log(err);
    console.log(`[CONNECTION] Unexpected error! ${err.message}     RESTARTING SERVER`);
    process.exit();
  });

  // try to reconnect if connection is closed for some reason
  client.on('end', () => {
    client.setTimeout(8000, () => {
      client.connect(config.auxServicePort, config.shardIP);
    });
  });
  return client;
}

module.exports = uoConn;

// , () => {
//   // 'connect' listener
//
//   const str = polString('muahahaha\n') + polString('muahahaha\n') + polString('muahahaha\n');
//   console.log(str);
//   client.write(str);
// })
