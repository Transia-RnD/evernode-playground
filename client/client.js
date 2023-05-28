const HotPocket = require("hotpocket-js-client");
// const lmdb = require('node-lmdb');

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
        // const outputLog = o.length <= 10000 ? o : `[Big output (${o.length / 1024} KB)]`;
        // console.log(`Output (ledger:${r.ledgerSeqNo})>> ${outputLog}`);
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

    // var env = new lmdb.Env();
    // env.open({
    //     // Path to the environment
    //     path: "mydata",
    //     // Maximum number of databases
    //     maxDbs: 10
    // });
    // var dbi = env.openDbi({
    //   name: "mydb2",
    //   create: true
    // });

    // Create transaction
    // var txn = env.beginTxn();

    // const value = { message: 'This is a message' }
    // const buffer = Buffer.from(JSON.stringify(value));
    // txn.putBinary(dbi, id, buffer);
    // txn.commit()

    // var binaryData = txn.getBinary(dbi, id);
    // txn.commit()
    // console.log("binary data: ", binaryData ? binaryData.toString() : null);
  }

  async create(userId, message) {
    const id = generateKey(20).trim();
    const type = "message";
    const command = "create";
    const data = {
      message: message,
      updatedTime: Date.now(),
      updatedBy: userId,
    };
    return this.submit(id, type, command, data);
  }

  async get(id) {
    const type = "message";
    const command = "get";
    return this.submit(id, type, command);
  }

  async submit(id, type, command, data) {
    let resolver, rejecter;
    const submitObj = {
      type: type,
      command: command,
    };

    if (data) {
      submitObj.data = data;
    }

    try {
      const data = { id: id, ...submitObj };
      const inpString = JSON.stringify(data);
      console.log(data);

      this.client.submitContractInput(inpString).then((input) => {
        input.submissionStatus.then((s) => {
          if (s.status !== "accepted") {
            console.log(`Ledger_Rejection: ${s.reason}`);
            throw `Ledger_Rejection: ${s.reason}`;
          }
        });
      });

      return new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
        this.promiseMap.set(id, { resolver: resolver, rejecter: rejecter });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

async function read(client, id, type, command) {
  const submitObj = {
    type: type,
    command: command,
  };
  try {
    const data = { id: id, ...submitObj };
    const inpString = JSON.stringify(data);
    console.log(data);
    const output = await client.submitContractReadRequest(inpString);
    console.log(output);
    if (!output) {
      return null;
    }
    if (output.error) {
      throw output.error;
    } else {
      return output.success;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// program to generate random strings

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

async function main() {
  var client = new ClientApp();
  if (await client.init()) {
    const userId = generateKey(32);
    const response = await client.create(userId, "This is a message");
    console.log(response.id);
    const messageData = await client.get(response.id);
    console.log(messageData);
  }
}
main();
