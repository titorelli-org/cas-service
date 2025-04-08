import { Logger } from "pino";
import { makePoller, type Poller } from "reactive-poller";
import Papa from "papaparse";
import { type UserFilter } from "../types";
import { type UseridRepo } from "./repositories/UseridRepo";

export class Combot implements UserFilter {
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

  async has(tgUserId: number): Promise<boolean> {
    return this.useridRepo.contains(tgUserId);
  }

  async add(tgUserId: number): Promise<void> {
    await this.useridRepo.add(tgUserId);
  }

  async delete(tgUserId: number): Promise<void> {
    await this.useridRepo.remove(tgUserId);
  }

  private fetchData = async () => {
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
