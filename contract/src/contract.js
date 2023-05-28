const HotPocket = require("hotpocket-nodejs-contract");
const { Sdk, ApiService, MessageModel, prepareRequest } = require('ever-lmdb-sdk');
const { convertStringToHex } = require('xrpl');
const { deriveAddress } = require('ripple-keypairs');

const contract = async (ctx) => {
  console.log('Smart Contract is running.');
  const isReadOnly = ctx.readonly;
  console.log(ctx.users);

  const api = new ApiService();
  for (const user of ctx.users.list()) {
    // console.log(user);
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
}


const hpc = new HotPocket.Contract();
hpc.init(contract);

// class User {
//   publicKey = ''
//   inputs = []
//   constructor(publicKey, inputs) {
//     this.publicKey = publicKey
//     this.inputs = inputs
//   }
//   async send(response) {
//     return new Promise(resolve => {
//       resolve(response);
//     });
//   }
// }
// class Users {
//   users = []
//   constructor(users) {
//     this.users = users
//   }

//   list() {
//     return this.users
//   }

//   read(input) {
//     return input.toString('utf-8');
//   }
// }

// function createMessage(ctx, user) {
//   const model = new MessageModel(
//     BigInt(1685216402734),
//     'LWslHQUc7liAGYUryIhoRNPDbWucJZjj',
//     'This is a message'
//   )
//   const address = deriveAddress(ctx.publicKey)
//   const path = `/Messages/${address}`
//   const publicKey = ctx.publicKey.toUpperCase()
//   const privateKey = ctx.privateKey.toUpperCase().slice(0, 66)
//   const binary = model.encode()
//   const request = prepareRequest(
//     '1',
//     'one',
//     'POST',
//     path,
//     binary,
//     publicKey,
//     privateKey
//   )
//   const inputs = [Buffer.from(JSON.stringify(request))];
//   user.inputs = inputs
//   ctx.users = new Users([user]);
//   contract(ctx)
// }

// function getMessage(ctx, user) {
//   const model = new MessageModel(
//     BigInt(1685216402734),
//     'LWslHQUc7liAGYUryIhoRNPDbWucJZjj',
//     'This is a message'
//   )
//   const address = deriveAddress(ctx.publicKey)
//   const path = `/Messages/${address}`
//   const publicKey = ctx.publicKey.toUpperCase()
//   const privateKey = ctx.privateKey.toUpperCase().slice(0, 66)
//   const bpath = convertStringToHex(path)
//   const request = prepareRequest(
//     '1',
//     'one',
//     'GET',
//     path,
//     bpath,
//     publicKey,
//     privateKey
//   )
//   const inputs = [Buffer.from(JSON.stringify(request))];
//   user.inputs = inputs
//   ctx.users = new Users([user]);
//   contract(ctx)
// }

// const ctx = {
//   contractId: "f511d0a8-24cb-4b08-bb5a-76ddafbb082c",
//   publicKey: "ed159e9bd047328760f85c0b17155735b90a15357ff4fe0148e1419a559045286f",
//   privateKey: "ed01d2f8ad542146b3e90d4c51b2038e57dbe48b7ad8342784da4f9c8f6cbe2080159e9bd047328760f85c0b17155735b90a15357ff4fe0148e1419a559045286f",
//   readonly: false,
//   timestamp: 1666586080258,
//   users: {},
//   unl: {},
//   lclSeqNo: 2,
//   lclHash: "7342fada37db5ed59b0ac5975d3cb84410127d9250be03bdfa8e568fabd648a8"
// }
// const user = new User(
//   'ed2593d14ca75a4970acd3fb8696e345c0baf6a43449ac2be9d8538b00d869dd7e',
// )
// createMessage(ctx, user)
// getMessage(ctx, user)