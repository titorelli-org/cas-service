import type { Logger } from "pino";
import type { UserFilter } from "../types";

export class CasService {
  constructor(
    private passFilter: UserFilter,
    private discardFilter: UserFilter,
    private logger: Logger,
  ) {}

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
