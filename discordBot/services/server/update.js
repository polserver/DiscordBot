const { exec } = require('child_process');
const config = require('../../config');

function runCommand(message) {
  return new Promise((resolve) => {
    const update_process = exec(`cd ${config.shardPath} && update_shard.bat`, (error, stdout, stderr) => {
      // if (error) return resolve();
      if (stderr) message.reply(stderr); console.log(stderr);
      if (stdout) message.reply(stdout); console.log(stdout);
    });

    update_process.on('exit', () => {
      resolve();
    });
  });
}

async function UpdateShard(message) {
  await runCommand(message);
}
module.exports = UpdateShard;
