const HotPocket = require("hotpocket-js-client");
const {
  Sdk,
  EverKeyPair,
  MessageModel,
  decodeModel,
  uint8ArrayToHex,
  hexToUint8Array,
} = require("ever-lmdb-sdk");
const { deriveAddress } = require("ripple-keypairs");

const nodeIp = process.env.REACT_APP_CONTRACT_NODE_IP || "localhost";
const nodePort = process.env.REACT_APP_CONTRACT_NODE_PORT || "8081";

class ClientApp {
  // Provide singleton instance
  static instance = ClientApp.instance || new ClientApp();

  userKeyPair = null;
  client = null;
  isConnectionSucceeded = false;
  server = `wss://${nodeIp}:${nodePort}`;

  isInitCalled = false;

  promiseMap = new Map();

  async init() {
    console.log("Initialized");
    if (this.userKeyPair == null) {
      this.userKeyPair = await HotPocket.generateKeys();
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
      console.log("Disconnected");
      this.isConnectionSucceeded = false;
    });

    // This will get fired as servers connects/disconnects.
    this.client.on(HotPocket.events.connectionChange, (server, action) => {
      console.log(server + " " + action);
    });

    // This will get fired when contract sends outputs.
    this.client.on(HotPocket.events.contractOutput, (r) => {
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
      console.log(ev);
    });

    if (!this.isConnectionSucceeded) {
      if (!(await this.client.connect())) {
        console.log("Connection failed.");
        return false;
      }
      console.log("HotPocket Connected.");
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
    const model = new MessageModel(
      BigInt(1685216402734),
      "LWslHQUc7liAGYUryIhoRNPDbWucJZjj",
      "This is a message"
    );
    const address = deriveAddress(everKp.publicKey);
    const sdk = new Sdk(everKp, client);
    const ref = sdk
      .collection("Messages")
      .document()
      .withConverter(MessageModel);
    // const post_response = await ref.set(model)
    // console.log(post_response);
    const message = await ref.get();
    console.log(message);
  }
}
main();
