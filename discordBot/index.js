const uoConn        = require('./modules/uoConn');
const serverPing    = require('./services/serverPing/serverPing');
const SendUoRequest = require('./services/sendUoRequest/sendUoRequest');
const ShardUpdate   = require('./services/server/update');
const PowerUpShard  = require('./services/server/powerup');
const CpuUsage      = require('./services/server/cpupercent');
const discordConn   = require('./modules/bot');
const config        = require('./config');
// const express    = require('./bot');

let updating = 0;
let powering = 0;

const event_list = {};

// Start function
(async () => {
  const bot_client = await discordConn();
  const bot_ultima = await uoConn();

  bot_ultima.on('connect', () => {
    console.log('connected to UO Server!');
    if (bot_client.channels.get(config.generalChannelID)) {
      bot_client.channels.get(config.generalChannelID).send('Server Status: Online!');
    }

    // client.end();
  });

  bot_client.on('message', async (message) => {
    const event_id = String(new Date().getTime());
    const msg = message.content.toLowerCase().split(' ');

    switch (msg[0]) {
      case '!who':
      case '!online': {
        SendUoRequest(bot_ultima, event_id, 'PlayersOnline');
        event_list[event_id] = message;
        break;
      }
      case '!whonames': {
        if (!message.member.roles.find(x => x.name === '@moderator')) return;
        const params = { username: msg[1], password: msg[2], email: msg[3] || '' };
        SendUoRequest(bot_ultima, event_id, 'WhosOnline', params);
        event_list[event_id] = message;
        break;
      }
      case '!ping': {
        const status = await serverPing();
        message.channel.send(`Server Status: ${status === true ? 'Online' : 'Offline'}`);
        break;
      }

      default:
        break;
    }

    // Only Administrator commands from here.
    if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.hasPermission('ADMINISTRATOR', 0, true, true)) return;
    switch (msg[0]) {
      case '!register': {
        const params = { username: msg[1], password: msg[2], email: msg[3] || '' };
        SendUoRequest(bot_ultima, event_id, 'RegisterAccount', params);
        event_list[event_id] = message;
        break;
      }
      case '!shutdown':
      case '!poweroff': {
        if (updating) break;

        const status = await serverPing();
        if (!status) return message.reply('Shard is not online. Use !poweron first.');
        SendUoRequest(bot_ultima, event_id, 'Shutdown', { time: msg[1] });
        message.reply('Shutdown command sent to server.!');
        break;
      }
      case '!rescue': {
        const status = await serverPing();
        if (!status) return message.reply('Shard is not online. Use !poweron first.');
        SendUoRequest(bot_ultima, event_id, 'Rescue', { mobile: msg[1] });
        message.reply('Attempting to save '+msg[1]+'!');
        break;
      }
      case '!banplayer': {
        const status = await serverPing();
        if (!status) return message.reply('Shard is not online. Use !poweron first.');
        SendUoRequest(bot_ultima, event_id, 'BanPlayer', { mobile: msg[1] });
        message.reply('Banning: '+msg[1]+'!');
        break;
      }
      case '!kickplayer': {
        const status = await serverPing();
        if (!status) return message.reply('Shard is not online. Use !poweron first.');
        SendUoRequest(bot_ultima, event_id, 'KickPlayer', { mobile: msg[1] });
        message.reply('Kicking: '+msg[1]+'!');
        break;
      }
      case '!jailplayer': {
        const status = await serverPing();
        if (!status) return message.reply('Shard is not online. Use !poweron first.');
        SendUoRequest(bot_ultima, event_id, 'JailPlayer', { mobile: msg[1] });
        message.reply('Jailing: '+msg[1]+'!');
        break;
      }
      case '!banaccount': {
        const status = await serverPing();
        if (!status) return message.reply('Shard is not online. Use !poweron first.');
        SendUoRequest(bot_ultima, event_id, 'BanAccount', { mobile: msg[1] });
        message.reply('Banning Account: '+msg[1]+'!');
        break;
      }
      case '!update': {
        if (updating) break;

        message.reply('Starting shard update. Please wait..');
        updating = 1;
        await ShardUpdate(message);
        updating = 0;
        SendUoRequest(bot_ultima, event_id, 'Unloadall');
        message.reply('Shard Update done!');
        break;
      }
      case '!poweron': {
        const status = await serverPing();

        if (status) message.reply('Server is already online. Use !shutdown frist.');
        else if (powering) message.reply("I'm already trying to start POL. Please wait!");

        message.reply('Trying to start POL server. It can take some minutes.');
        powering = 1;
        await PowerUpShard();
        powering = 0;
        message.reply('Server Started.');
        break;
      }
      case '!cpu': {
        const cpu_usage = await CpuUsage();
        message.reply(`CPU total usage is ${cpu_usage}%`);
        break;
      }
      case '!unloadall': {
        if (updating) break;

        SendUoRequest(bot_ultima, event_id, 'Unloadall');
        message.reply('Shard Unloaded!');
        break;
      }
      default:
        break;
    }
  });

  // Handle POL packets to Discord.
  bot_ultima.on('data', async (data) => {
    if (!data) return;
    data = data.toString();

    // No sure why, but POL sends \r\n sometimes.
    if (!data || data === '\r\n') return;

    // Parse to JSON format.
    data = JSON.parse(data);

    // Just to make sure data.id is in string format.
    data.id = String(data.id);

    if (data.key === 'Response') {
      await event_list[data.id].reply(data.value).catch(console.log);
      delete event_list[data.id];
    } else if (data.key === 'GeneralMessage') {
      bot_client.channels.get(config.generalChannelID).send(data.message);
    } else if (data.key === 'LogMessage') {
      bot_client.channels.get(config.log).send(data.message);
    } else if (data.key === 'StaffMessage') {
      bot_client.channels.get(config.staffChannelID).send(data.message);
    } else if (data.key === 'RegisterAccount') {
      event_list[data.id].reply('Success! Account succesfully created!').catch(console.log);
      delete event_list[data.id];
    }
  });
})();
