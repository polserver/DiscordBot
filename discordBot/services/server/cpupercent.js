const os = require('os-utils');

function GetCpu() {
  return new Promise((resolve) => {
    os.cpuUsage(resolve);
  });
}

async function CheckCpuUsage() {
  const p = await GetCpu();
  return p.toFixed(2);
}

module.exports = CheckCpuUsage;
