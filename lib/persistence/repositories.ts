import { logger } from "../logger";
import { TotemsRepo } from "../totems/repositories/TotemsRepo";
import { UseridRepo as LolsUseridRepo } from "../lols/repositories/UseridRepo";
import { UseridRepo as CombotUseridRepo } from "../combot/repositories/UseridRepo";
import { db } from "./db";

export const totemsRepo = new TotemsRepo(db as any, logger);
export const lolsRepo = new LolsUseridRepo(db as any, logger);
export const combotRepo = new CombotUseridRepo(db as any, logger);
