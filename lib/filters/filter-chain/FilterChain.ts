import type { Logger } from "pino";
import type { Startable, UserFilter } from "../../types";

export class FilterChain implements UserFilter, Startable {
  constructor(
    private filters: (UserFilter & Startable)[],
    private logger: Logger,
  ) {}

  public async start(): Promise<void> {
    await Promise.all(this.filters.map((f) => f.start()));
  }

  public async stop(): Promise<void> {
    await Promise.all(this.filters.map((f) => f.stop()));
  }

  async has(tgUserId: number): Promise<[boolean, string]> {
    for (const filter of this.filters) {
      const [banned, reason] = await filter.has(tgUserId);

      if (banned) return [banned, reason];
    }

    return [false, "chain"];
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
