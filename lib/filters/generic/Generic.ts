import { type Logger } from "pino";
import { Startable, type UserFilter } from "../../types";
import { type UseridRepo } from "./repositories/UseridRepo";

export class Generic implements UserFilter, Startable {
  constructor(private useridRepo: UseridRepo, private logger: Logger) {}

  public async start(): Promise<void> {
    // Do nothing
  }

  public async stop(): Promise<void> {
    // Do nothing
  }

  async has(tgUserId: number): Promise<[boolean, string]> {
    console.time(`Generic.has(${tgUserId})`);

    const banned = await this.useridRepo.contains(tgUserId);

    console.timeEnd(`Generic.has(${tgUserId})`);

    return [banned, "generic"];
  }

  async add(tgUserId: number): Promise<void> {
    await this.useridRepo.add(tgUserId);
  }

  async delete(tgUserId: number): Promise<void> {
    await this.useridRepo.remove(tgUserId);
  }
}
