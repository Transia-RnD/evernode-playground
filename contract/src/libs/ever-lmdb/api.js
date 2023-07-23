import { DbService } from "ever-lmdb-sdk";

export class ApiService {
  // @ts-expect-error - leave this alone
  #dbService = null;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handleRequest(user, request, isReadOnly) {
    console.log(`HANDLE REQUEST: ${request.method}`);
    let result;

    try {
      this.#dbService = new DbService(request);
      this.#dbService.loadrules();
    } catch (error) {
      await user.send({ id: request.id, error: error.message });
    }
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
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendOutput = async (user, response) => {
    await user.send(response);
  };
}
