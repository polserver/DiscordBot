const isReachable = require('is-reachable');
const config = require('../../config');

async function serverPing() {
  return isReachable(`${config.shardIP}:${config.shardPort}`).catch((e) => { console.log(e); return null; });
}
module.exports = serverPing;
