const evernode = require("evernode-js-client");
require("dotenv/config");

const debug = require("debug");
const log = debug("contract:client");

async function acquire() {
  const tenantAddress = process.env.EV_TENANT_ADDRESS;
  const tenantSecret = process.env.EV_TENANT_SECRET;
  const tenant = new evernode.TenantClient(tenantAddress, tenantSecret, {
    governorAddress: process.env.EV_GOV_ADDRESS,
    rippledServer: process.env.WSS_RIPPLED_SERVER,
  });
  console.log(tenant);
  await tenant.connect();

  try {
    const timeout = 10000;
    const moments = 10;
    const instanceName = process.env.CONTRACT_NODE_NAME; // get from deployment info
    const hostAddress = process.env.CONTRACT_NODE_ADDRESS; // get from deployment info

    const result = await tenant.extendLease(hostAddress, moments, instanceName);
    log("Tenant received instance ", result);
  } catch (err) {
    log("Tenant received acquire error: ", err.reason);
  }
}

acquire();
