const HotPocket = require("hotpocket-js-client");
const {
  LogEmitter,
  Sdk,
  EverKeyPair,
  OwnerModel,
  ChatModel,
  MessageModel,
  uint8ArrayToHex,
  hexToUint8Array,
} = require("ever-lmdb-sdk");
const { deriveAddress } = require("@transia/ripple-keypairs");
require("dotenv/config");

const nodeIp = process.env.CONTRACT_NODE_IP || "localhost";
const nodePort = process.env.CONTRACT_NODE_PORT || "8081";

class ClientApp {
  // Provide singleton instance
  static instance = ClientApp.instance || new ClientApp();

  userKeyPair = null;
  client = null;
  isConnectionSucceeded = false;
  server = `wss://${nodeIp}:${nodePort}`;
  logger = new LogEmitter("client-playground", "client");

  isInitCalled = false;

  promiseMap = new Map();

  async init() {
    this.logger.info("Initialized");
    if (this.userKeyPair == null) {
      // this.userKeyPair = await HotPocket.generateKeys();
      this.userKeyPair = {
        publicKey: hexToUint8Array(
          "ED0807B9DA22DEBA87ABCBF8F5E9CF242F585158AA5D653CDB080AB04B0A8A6E89"
        ),
        privateKey: hexToUint8Array(
          "ED86EB7A3DB392BCA921259F722BBA46B0B742678BFEABA198B2FE7EB7C776F3220807B9DA22DEBA87ABCBF8F5E9CF242F585158AA5D653CDB080AB04B0A8A6E89"
        ),
      };
    }
    if (this.client == null) {
      this.client = await HotPocket.createClient(
        [this.server],
        this.userKeyPair
      );
    }

    // This will get fired if HP server disconnects unexpectedly.
    this.client.on(HotPocket.events.disconnect, () => {
      this.logger.info("Disconnected");
      this.isConnectionSucceeded = false;
    });

    // This will get fired as servers connects/disconnects.
    this.client.on(HotPocket.events.connectionChange, (server, action) => {
      this.logger.info(server + " " + action);
    });

    // This will get fired when contract sends outputs.
    this.client.on(HotPocket.events.contractOutput, (r) => {
      this.logger.info(r);
      r.outputs.forEach((o) => {
        const pId = o.id;
        if (o.error) {
          this.promiseMap.get(pId).rejecter(o.error);
        } else {
          this.promiseMap.get(pId).resolver(o.success);
        }

        this.promiseMap.delete(pId);
      });
    });

    this.client.on(HotPocket.events.healthEvent, (ev) => {
      this.logger.info(ev);
    });

    if (!this.isConnectionSucceeded) {
      if (!(await this.client.connect())) {
        this.logger.info("Connection failed.");
        return false;
      }
      this.logger.info("HotPocket Connected.");
      this.isConnectionSucceeded = true;
    }

    this.isInitCalled = true;

    return true;
  }
}

async function main() {
  var client = new ClientApp();
  if (await client.init()) {
    // Create the KeyPair for ever-lmdb
    const everKp = new EverKeyPair(
      uint8ArrayToHex(client.userKeyPair.publicKey),
      uint8ArrayToHex(client.userKeyPair.privateKey).slice(0, 66)
    );
    console.log("CONNECTED");
  }
}

async function createChat() {
  var client = new ClientApp();
  if (await client.init()) {
    // Create the KeyPair for ever-lmdb
    const everKp = new EverKeyPair(
      uint8ArrayToHex(client.userKeyPair.publicKey),
      uint8ArrayToHex(client.userKeyPair.privateKey).slice(0, 66)
    );
    const address = deriveAddress(everKp.publicKey);
    const sdk = new Sdk(client.logger, everKp, client);
    const owner1 = new OwnerModel(address);
    const owner2 = new OwnerModel("rGVfAGdDF9fzsmfePkyHK2HnD25BKMKNbr");
    const chatModel = new ChatModel(address, [owner1, owner2]);
    const chatRef = sdk.collection("Chats").document();
    chatRef.withConverter(ChatModel);
    console.log(chatRef.path);
    await chatRef.set(chatModel);
    const chat = await chatRef.get();
    console.log(chat);
  }
}

async function getChat() {
  var client = new ClientApp();
  if (await client.init()) {
    // Create the KeyPair for ever-lmdb
    const everKp = new EverKeyPair(
      uint8ArrayToHex(client.userKeyPair.publicKey),
      uint8ArrayToHex(client.userKeyPair.privateKey).slice(0, 66)
    );
    const sdk = new Sdk(client.logger, everKp, client);
    const chatRef = sdk
      .collection("Chats")
      .document("SuCP08CcCreFGeg6hSbawOIs1rJhQzWH");
    chatRef.withConverter(ChatModel);
    const chat = await chatRef.get();
    console.log(chat);
  }
}

async function createMessage() {
  var client = new ClientApp();
  if (await client.init()) {
    // Create the KeyPair for ever-lmdb
    const everKp = new EverKeyPair(
      uint8ArrayToHex(client.userKeyPair.publicKey),
      uint8ArrayToHex(client.userKeyPair.privateKey).slice(0, 66)
    );
    const address = deriveAddress(everKp.publicKey);
    const sdk = new Sdk(everKp, client);
    const model = new MessageModel(
      BigInt(1685216402734),
      "LWslHQUc7liAGYUryIhoRNPDbWucJZjj",
      "This is a message"
    );
    const chatRef = sdk.collection("Chats").document();
    chatRef.withConverter(MessageModel);
    const messageRef = chatRef.collection("Messages").document(address);
    const chatResponse = await chatRef.set(chatModel);
    const post_response = await ref.set(model);
    // console.log(post_response);
    const message = await ref.get();
    console.log(message);
  }
}

// createChat();
// getChat();
// createMessage();
main();
