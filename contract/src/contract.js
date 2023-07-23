const HotPocket = require("hotpocket-nodejs-contract");
const { ApiService } = require("libs/ever-lmdb/api");

const contract = async (ctx) => {
  const isReadOnly = ctx.readonly;
  const api = new ApiService();
  // const custom = new CustomService();
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
