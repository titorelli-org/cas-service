import { type Logger } from "pino";
import { type UserFilter } from "../../types";
import { type UseridRepo } from "./repositories/UseridRepo";
import { makePoller, type Poller } from "reactive-poller";
import { type BanListItem } from "./types";

export class Lols implements UserFilter {
  private poller: Poller<any>;

  constructor(private useridRepo: UseridRepo, private logger: Logger) {
    this.poller = makePoller({
      dataProvider: this.fetchData,
      errorHandler(error) {
        logger.error(error);
      },
      interval: 3600000 /* 1 hour */,
    });

    this.poller.onData$.subscribe(this.saveList);

    this.poller.start();
  }

  async has(tgUserId: number): Promise<[boolean, string]> {
    const banned = await this.useridRepo.contains(tgUserId);

    return [banned, "lols"];
  }

  async add(tgUserId: number): Promise<void> {
    await this.useridRepo.add(tgUserId);
  }

  async delete(tgUserId: number): Promise<void> {
    await this.useridRepo.remove(tgUserId);
  }

  private async fetchLists() {
    try {
      const resp = await fetch("https://api.lols.bot/lists");
      const data = (await resp.json()) as BanListItem[];

      return data;
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async getListHref(
    id: "scammers" | "spammers-full" | "spammers-1h",
    format: "json" | "csv" | "plain",
  ) {
    const banLists = await this.fetchLists();

    if (!banLists) return null;

    for (const banList of banLists) {
      if (id === banList.id) return banList.format[format] ?? null;
    }

    return null;
  }

  private fetchData = async () => {
    const listHref = await this.getListHref("spammers-1h", "json");

    if (!listHref) return null;

    const resp = await fetch(listHref);
    const data = (await resp.json()) as Awaited<string[]>;

    return data.map(Number);
  };

  private saveList = async (tgUserIds: number[]) => {
    await this.useridRepo.bulkInsert(tgUserIds);
  };
}
