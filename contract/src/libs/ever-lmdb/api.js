import { DbService } from "ever-lmdb-sdk";
const { LogEmitter } = require("ever-lmdb-sdk/dist/npm/src/services/logger");

export class ApiService {
  #id = null
  // @ts-expect-error - leave this alone
  #dbService = null
  logger = null

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(id) {
    this.#id = id
    this.logger = new LogEmitter(this.#id, 'api')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handleRequest(user, request, isReadOnly) {
    let result;
    try {
      this.#dbService = new DbService(this.#id, request);
      this.#dbService.loadrules();
      if (request.method == "POST") {
        // Your functionality here
        result = await this.#dbService.create();
      }
      if (request.method == "PUT") {
        // Your functionality here
        result = await this.#dbService.update();
      }
      if (request.method == "DELETE") {
        // Your functionality here
        result = await this.#dbService.delete();
      }
      if (request.method == "GET") {
        // Your functionality here
        result = await this.#dbService.get();
      }
  
      // Add your custom functions here
      if (request.method == "addOwner") {
        // Your functionality here
        result = await this.#dbService.get();
      }
      if (request.method == "removeOwner") {
        // Your functionality here
        result = await this.#dbService.get();
      }
  
      if (isReadOnly) {
        await this.sendOutput(user, result);
      } else {
        await this.sendOutput(user, { id: request.id, ...result });
      }
    } catch (error) {
      this.logger.error(error.message)
      await user.send({ id: request.id, error: error.message });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendOutput = async (user, response) => {
    try {
      this.logger.info('SENDING OUTPUT')
      await user.send(response);
    } catch (error) {
      this.logger.error(error.message)
    }
  };
}
