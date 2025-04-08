import type { Logger } from "pino";
import type { UserFilter } from "../types";

export class CasService {
  constructor(
    private passFilter: UserFilter,
    private discardFilter: UserFilter,
    private logger: Logger,
  ) {}

  async isBanned(tgUserId: number) {
    if (await this.passFilter.has(tgUserId)) return false;

    return this.discardFilter.has(tgUserId);
  }

  async ban(tgUserId: number) {
    await this.discardFilter.add(tgUserId);
  }

  async protect(tgUserId: number) {
    await this.passFilter.add(tgUserId);
  }
}
