import { type Logger } from "pino";
import { type UserFilter } from "../../types";
import { type UseridRepo } from "./repositories/UseridRepo";

export class Generic implements UserFilter {
  constructor(private useridRepo: UseridRepo, private logger: Logger) {}

  async has(tgUserId: number): Promise<boolean> {
    return this.useridRepo.contains(tgUserId);
  }

  async add(tgUserId: number): Promise<void> {
    await this.useridRepo.add(tgUserId);
  }

  async delete(tgUserId: number): Promise<void> {
    await this.useridRepo.remove(tgUserId);
  }
}
