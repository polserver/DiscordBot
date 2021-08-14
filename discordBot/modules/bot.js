const Discord  = require('discord.js');
const client = new Discord.Client();
const config = require('../config');

function startClient() {
  client.login(config.discordToken);

  client.on('ready', () => {
    console.log('Connected to Discord Bot!!');
  });

  return client;
}

module.exports = startClient;
