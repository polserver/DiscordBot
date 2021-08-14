module.exports = {
  // Shard configurations.
  shardIP: process.env.SHARD_IP || 'localhost',
  shardPort: process.env.SHARD_PORT || '7003',
  auxServicePort: process.env.BOT_PORT || '2973',
  auxServicePassword: process.env.BOT_PASSOWRD || 'NllB0t@cc3ss',

  // Commands like !update and !poweron run commands in the shard path.
  // Be in mind that this BOT was made to run in the same server POL is running.
  shardPath: 'F:/Users/Jono/Documents/neverlandslegacy',

  // Discord BOT token.
  discordToken: 'NTU4OTY2MjM0NjYyNjk5MDA4.D3eizQ.ljyXYo6tIMIe3rK3ThSG-eF0PPg',

  // Get the channels ID using Discord in Developer Mode.
  generalChannelID: '463972004832477184',
  logChannelID: '516613411107241994',
  staffChannelID: '466878236589031425',
};
