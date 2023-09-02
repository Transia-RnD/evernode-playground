const HotPocket = require("hotpocket-nodejs-contract");
const { LogEmitter } = require("ever-lmdb-sdk/dist/npm/src/services/logger");
const { ApiService } = require("./libs/ever-lmdb/api");
// const { ApiService } = require("ever-lmdb-sdk");

const contract = async (ctx) => {
  const isReadOnly = ctx.readonly;
  const logger = new LogEmitter(`test-${ctx.contractId}`, "contract");
  const api = new ApiService(`test-${ctx.contractId}`);
  // const custom = new CustomService();
  logger.info("CONTRACT PING");
  for (const user of ctx.users.list()) {
    // Loop through inputs sent by each user.
    for (const input of user.inputs) {
      // Read the data buffer sent by user (this can be any kind of data like string, json or binary data).
      const buf = await ctx.users.read(input);

      // Let's assume all data buffers for this contract are JSON.
      const request = JSON.parse(buf);

      // Pass the JSON request to our application logic component.
      await api.handleRequest(user, request, isReadOnly);
    }
  }
};
const hpc = new HotPocket.Contract();
hpc.init(contract);
