import type { Logger } from "pino";
import type { Startable, UserFilter } from "../types";

export class CasService implements Startable {
  constructor(
    private passFilter: UserFilter & Startable,
    private discardFilter: UserFilter & Startable,
    private logger: Logger,
  ) {}

  public async start() {
    await Promise.all([this.passFilter.start(), this.discardFilter.start()]);
  }

  public async stop() {
    await Promise.all([this.passFilter.stop(), this.discardFilter.stop()]);
  }

  async isBanned(tgUserId: number) {
    {
      const [passed, reason] = await this.passFilter.has(tgUserId);

      if (passed) {
        return {
          banned: false,
          reason,
        };
      }
    }

    const [banned, reason] = await this.discardFilter.has(tgUserId);

    return {
      banned,
      reason,
    };
  }

  async ban(tgUserId: number) {
    await this.discardFilter.add(tgUserId);
  }

  async protect(tgUserId: number) {
    await this.passFilter.add(tgUserId);
  }
}
