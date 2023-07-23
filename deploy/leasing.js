const evernode = require("evernode-js-client");

const debug = require("debug");
const log = debug("contract:client");

async function acquire() {
  const tenantAddress = "rEwL1ND2JLWw2dA38fcY1hMq39QJL8nsqi";
  const tenantSecret = "sh2TnuWTvChC5gzeJeC9LrHXBSoVD";
  const tenant = new evernode.TenantClient(tenantAddress, tenantSecret, {
    governorAddress: "rGVHr1PrfL93UAjyw3DWZoi9adz2sLp2yL",
    rippledServer: "wss://hooks-testnet-v3.xrpl-labs.com",
  });
  await tenant.connect();

  try {
    const timeout = 10000;
    const moments = 5;
    const instanceName =
      "491D0C9F35D49BE690074814179907E8EA989724BB1E0BC9054B64E6F00F2464"; // get from deployment info
    const hostAddress = "rLHzHbqGF4RCf5Z9oDNQfvPXY5wGaKZrp4"; // get from deployment info

    const result = await tenant.extendLease(hostAddress, moments, instanceName);
    log("Tenant received instance ", result);
  } catch (err) {
    log("Tenant received acquire error: ", err.reason);
  }
}

acquire();
