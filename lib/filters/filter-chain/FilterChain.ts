import type { Logger } from "pino";
import type { UserFilter } from "../../types";

export class FilterChain implements UserFilter {
  constructor(private filters: UserFilter[], private logger: Logger) {}

  async has(tgUserId: number): Promise<boolean> {
    for (const filter of this.filters) {
      const banned = await filter.has(tgUserId);

      if (banned) return banned;
    }

    return false;
  }

  async add(tgUserId: number): Promise<void> {
    for (const filter of this.filters) {
      await filter.add(tgUserId);
    }
  }

  async delete(tgUserId: number): Promise<void> {
    for (const filter of this.filters) {
      await filter.delete(tgUserId);
    }
  }
}
