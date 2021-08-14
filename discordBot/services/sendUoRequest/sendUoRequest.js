const config = require('../../config');


async function sendUoRequest(uo_client, id, request_type, params = {}) {
  params.id = id;
  params.request = request_type;
  params.password = config.auxServicePassword;

  const send_to = JSON.stringify(params);
  uo_client.write(`${send_to}\n`);
}
module.exports = sendUoRequest;
