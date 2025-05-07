import type { Logger } from "pino";
import { CasService } from "./cas-service";
import {
  Totems,
  FilterChain,
  Generic,
  Immutable,
  Lols,
  Combot,
} from "./filters";
import { totemsRepo, genericRepo, lolsRepo, combotRepo } from "./persistence";

export const createCasService = (logger: Logger) => {
  return new CasService(
    new Totems(totemsRepo),
    new FilterChain(
      [
        new Generic(genericRepo, logger),
        new Immutable(new Lols(lolsRepo, logger)),
        new Immutable(new Combot(combotRepo, logger)),
      ],
      logger,
    ),
    logger,
  );
};
