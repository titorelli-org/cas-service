import { Logger } from "pino";
import { makePoller, Unsubscribe, type Poller } from "reactive-poller";
import Papa from "papaparse";
import { Startable, type UserFilter } from "../../types";
import { type UseridRepo } from "./repositories/UseridRepo";

export class Combot implements UserFilter, Startable {
  private poller: Poller<any>;
  private unsubscribe$: Unsubscribe;

  constructor(private useridRepo: UseridRepo, private logger: Logger) {
    this.poller = makePoller({
      dataProvider: this.fetchData,
      errorHandler(error) {
        logger.error(error);
      },
      interval: 3600000 /* 1 hour */,
    });
  }

  public async start() {
    this.unsubscribe$ = this.poller.onData$.subscribe(this.saveList);

    await this.poller.start();
  }

  public async stop() {
    this.unsubscribe$();

    await this.poller.stop();
  }

  async has(tgUserId: number): Promise<[boolean, string]> {
    const banned = await this.useridRepo.contains(tgUserId);

    return [banned, "cas"];
  }

  async add(tgUserId: number): Promise<void> {
    await this.useridRepo.add(tgUserId);
  }

  async delete(tgUserId: number): Promise<void> {
    await this.useridRepo.remove(tgUserId);
  }

  private fetchData = async () => {
    this.logger.info("Fetching list from combot...");

    const resp = await fetch("https://api.cas.chat/export.csv");
    const text = await resp.text();

    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        complete({ data }: { data: string[][] }) {
          const results = data.flatMap((row) => row.map(Number));

          resolve(results);
        },
        error(error: any) {
          reject(error);
        },
      });
    });
  };

  private saveList = async (tgUserIds: number[]) => {
    await this.useridRepo.bulkInsert(tgUserIds);
  };
}
