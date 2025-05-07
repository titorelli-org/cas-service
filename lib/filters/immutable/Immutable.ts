import type { Startable, UserFilter } from "../../types";

export class Immutable implements UserFilter, Startable {
  constructor(private impl: UserFilter & Startable) {}

  public async start(): Promise<void> {
    await this.impl.start();
  }

  public async stop(): Promise<void> {
    await this.impl.start();
  }

  has(tgUserId: number): Promise<[boolean, string]> {
    return this.impl.has(tgUserId);
  }

  add(tgUserId: number): Promise<void> {
    return Promise.resolve();
  }

  delete(tgUserId: number): Promise<void> {
    return Promise.resolve();
  }
}
