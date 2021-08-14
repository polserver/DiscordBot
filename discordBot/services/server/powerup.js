
const { exec } = require('child_process');
const serverPing    = require('../serverPing/serverPing');
const config = require('../../config');

function wait(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

function runCommand() {
  return new Promise((resolve) => {
    exec(`cd ${config.shardPath} && start_pol.bat`, (err, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.log(stderr);
    }).unref();

    resolve();
  });
}

async function powerup() {
  //Below is for Linux
  //exec('kilall -9 pol');
  exec('taskkill /f /pid pol.exe');
  await wait(2);

  while (1) {
    const status = await serverPing();
    if (status) return;
    console.log('Trying to Start POL');

    await runCommand();
    await wait(7);
  }
}
module.exports = powerup;

