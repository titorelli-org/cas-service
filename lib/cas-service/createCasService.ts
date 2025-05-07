import type { Logger } from "pino";
import { CasService } from "./CasService";
import { totemsRepo, genericRepo, lolsRepo, combotRepo } from "../persistence";
import { CasServiceFactory } from "./CasServiceFactory";

export const createCasService = (logger: Logger) => {
  const { totems, chain, generic, immutable, lols, combot } =
    new CasServiceFactory({
      totemsRepo,
      genericRepo,
      lolsRepo,
      combotRepo,
      logger,
    });

  return new CasService(
    totems(),
    chain([generic(), immutable(lols()), immutable(combot())]),
    logger,
  );
};
