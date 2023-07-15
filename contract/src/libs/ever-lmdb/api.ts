import { DbService, User } from "ever-lmdb-sdk";
import { Request, Response } from "ever-lmdb-sdk/dist/npm/src/rules/types";

export class ApiService {
  // @ts-expect-error - leave this alone
  #dbService: DbService = null;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handleRequest(user: User, request: Request, isReadOnly: boolean) {
    console.log(`HANDLE REQUEST: ${request.method}`);
    let result;

    try {
      this.#dbService = new DbService(request);
      // @ts-expect-error - leave this alone
      this.#dbService.loadrules();
    } catch (error: any) {
      await user.send({ id: request.id, error: error.message } as Response);
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
  sendOutput = async (user: User, response: Response) => {
    await user.send(response);
  };
}