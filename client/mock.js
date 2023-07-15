const HotPocket = require("hotpocket-js-client");
const { Sdk, MessageModel } = require("ever-lmdb-sdk");
const { deriveAddress } = require("xrpl");
const {} = require("ripple-keypairs");
// const lmdb = require('node-lmdb');

const nodeIp = process.env.REACT_APP_CONTRACT_NODE_IP || "localhost";
const nodePort = process.env.REACT_APP_CONTRACT_NODE_PORT || "8081";

class InputStatus {
  status = "";
  reason = "";
  constructor(status, reason) {
    this.status = status;
    this.reason = reason;
  }
}
class Input {
  input = "";
  constructor(input) {
    this.input = input;
  }

  async submissionStatus() {
    return new Promise((resolve) => {
      resolve(new InputStatus("accepted", "Mock Reason"));
    });
  }
}
class Output {
  error = "";
  success = "";
  constructor(input) {
    this.input = input;
  }
}

class ClientApp {
  // Provide singleton instance
  static instance = ClientApp.instance || new ClientApp();

  userKeyPair = null;
  client = null;
  isInitCalled = false;
  promiseMap = new Map();

  async init() {
    console.log("Initialized");
    if (this.userKeyPair == null) {
      this.userKeyPair = await HotPocket.generateKeys();
    }
    this.client = new MockClient();
    this.isInitCalled = true;

    return true;
  }
}

// declare all characters
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateKey(length) {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function hexKey(key) {
  return key
    .reduce(
      (accumulator, value) => accumulator + value.toString(16).padStart(2, "0"),
      ""
    )
    .toUpperCase();
}

async function main() {
  var client = new ClientApp();
  if (await client.init()) {
    const userId = generateKey(32);
    console.log(userId);

    // POST
    const model = new MessageModel(
      BigInt(1685216402734),
      "LWslHQUc7liAGYUryIhoRNPDbWucJZjj",
      "This is a message"
    );
    console.log(model);
    const keypair = {
      publicKey: hexKey(client.userKeyPair.publicKey),
      privateKey: hexKey(client.userKeyPair.privateKey),
    };
    console.log(keypair);
    const binary = model.encode();
    console.log(binary);
    const sdk = new Sdk("one", keypair, client.client);
    const ref = sdk
      .collection("Messages")
      .document()
      .withConverter(MessageModel);
    const postResponse = await ref.set(model);
    console.log(postResponse);
    // const response = await client.create(userId, "This is a message");
    // console.log(response.id);
    // const messageData = await client.get(response.id);
    // console.log(messageData);
  }
}
main();

// EverKeyPair {
//   publicKey: 'ED0807B9DA22DEBA87ABCBF8F5E9CF242F585158AA5D653CDB080AB04B0A8A6E89',
//   privateKey: 'ED86EB7A3DB392BCA921259F722BBA46B0B742678BFEABA198B2FE7EB7C776F3220807B9DA22DEBA87ABCBF8F5E9CF242F585158AA5D653CDB080AB04B0A8A6E89'
// }
