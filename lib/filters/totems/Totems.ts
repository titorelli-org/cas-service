import { UserFilter } from "../../types";
import { TotemsRepo } from "./repositories/TotemsRepo";

export class Totems implements UserFilter {
  constructor(private totemsRepo: TotemsRepo) {}

  /**
   * For totems, `has()` operation inverted in meaning:
   * if user has totem, it means that
   * user should be not banned
   */
  async has(tgUserId: number): Promise<[boolean, string]> {
    const passed = await this.totemsRepo.contains(tgUserId);

    return [passed, "totem"];
  }

  async add(tgUserId: number): Promise<void> {
    await this.totemsRepo.add(tgUserId);
  }

  async delete(tgUserId: number): Promise<void> {
    await this.totemsRepo.remove(tgUserId);
  }
}
