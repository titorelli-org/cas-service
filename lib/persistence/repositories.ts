import { logger } from "../logger";
import { TotemsRepo } from "../filters/totems/repositories";
import { UseridRepo as LolsUseridRepo } from "../filters/lols/repositories";
import { UseridRepo as CombotUseridRepo } from "../filters/combot/repositories";
import { UseridRepo as GenericUseridRepo } from "../filters/generic/repositories";
import { db } from "./db";

export const totemsRepo = new TotemsRepo(db as any, logger);
export const lolsRepo = new LolsUseridRepo(db as any, logger);
export const combotRepo = new CombotUseridRepo(db as any, logger);
export const genericRepo = new GenericUseridRepo(db as any, logger);
