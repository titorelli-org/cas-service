import type { Logger } from "pino";
import type { Startable, UserFilter } from "../../types";
import type { TotemsRepo } from "./repositories/TotemsRepo";

export class Totems implements UserFilter, Startable {
  constructor(private totemsRepo: TotemsRepo, private logger: Logger) {}

  public async start(): Promise<void> {
    // Do nothing
  }

  public async stop(): Promise<void> {
    // Do nothing
  }

  /**
   * For totems, `has()` operation inverted in meaning:
   * if user has totem, it means that
   * user should be not banned
   */
  async has(tgUserId: number): Promise<[boolean, string]> {
    console.time(`Totems.has(${tgUserId})`);

    const passed = await this.totemsRepo.contains(tgUserId);

    console.timeEnd(`Totems.has(${tgUserId})`);

    return [passed, "totem"];
  }

  async add(tgUserId: number): Promise<void> {
    await this.totemsRepo.add(tgUserId);
  }

  async delete(tgUserId: number): Promise<void> {
    await this.totemsRepo.remove(tgUserId);
  }
}
