import { DbService, User } from "ever-lmdb-sdk";
import { Request, Response } from "ever-lmdb-sdk/dist/npm/src/rules/types";

export class CustomService {
  // @ts-expect-error - leave this alone
  #dbService: DbService = null;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handleRequest(user: User, request: Request, isReadOnly: boolean) {
    console.log(`HANDLE REQUEST: ${request.method}`);
    let result;

    // CUSTOM CALL
    if (request.method == "addOwner") {
      result = await this.#dbService.create();
    }
    if (request.method == "removeOwner") {
      result = await this.#dbService.update();
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
