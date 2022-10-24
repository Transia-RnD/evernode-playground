const HotPocket = require("hotpocket-nodejs-contract");
const { ApiService } = require('./services/api');
const { DbService } = require("./core_services/dbService");

const contract = async (ctx) => {
  console.log('Smart Contract is running.');
  const isReadOnly = ctx.readonly;

  const api = new ApiService();
  await DbService.initializeDatabase();

  console.log(ctx.users);
  for (const user of ctx.users.list()) {
    // console.log(user);
    // Loop through inputs sent by each user.
    for (const input of user.inputs) {

      // Read the data buffer sent by user (this can be any kind of data like string, json or binary data).
      const buf = await ctx.users.read(input);

      // Let's assume all data buffers for this contract are JSON.
      const message = JSON.parse(buf);

      console.log(message);
      // Pass the JSON message to our application logic component.
      await api.handleRequest(user, message, isReadOnly);
    }
  }
}


const hpc = new HotPocket.Contract();
hpc.init(contract);
// const ctx = {
//     contractId: "f511d0a8-24cb-4b08-bb5a-76ddafbb082c",
//     publicKey: "ed159e9bd047328760f85c0b17155735b90a15357ff4fe0148e1419a559045286f",
//     privateKey: "ed01d2f8ad542146b3e90d4c51b2038e57dbe48b7ad8342784da4f9c8f6cbe2080159e9bd047328760f85c0b17155735b90a15357ff4fe0148e1419a559045286f",
//     readonly: false,
//     timestamp: 1666586080258,
//     users: {},
//     unl: {},
//     lclSeqNo: 2,
//     lclHash: "7342fada37db5ed59b0ac5975d3cb84410127d9250be03bdfa8e568fabd648a8"
// }

// const input = {
//   promiseId: 1,
//   type: 'message',
//   command: 'create',
//   data: { message: 'This is a message' }
// };
// const inputs = [Buffer.from(JSON.stringify(input))];
// const user = {
//   publicKey: 'ed2593d14ca75a4970acd3fb8696e345c0baf6a43449ac2be9d8538b00d869dd7e',
//   inputs: inputs
// }
// ctx.users = [user];
// console.log(user);
// console.log(ctx);
// contract(ctx)