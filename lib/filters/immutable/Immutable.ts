import type { UserFilter } from "../../types";

export class Immutable implements UserFilter {
  constructor(private impl: UserFilter) {}

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
