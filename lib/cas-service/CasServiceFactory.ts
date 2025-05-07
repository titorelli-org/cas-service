import type { TotemsRepo } from "../filters/totems/repositories";
import type { UseridRepo as LolsUseridRepo } from "../filters/lols/repositories";
import type { UseridRepo as CombotUseridRepo } from "../filters/combot/repositories";
import type { UseridRepo as GenericUseridRepo } from "../filters/generic/repositories";
import type { Logger } from "pino";
import {
  Combot,
  FilterChain,
  Generic,
  Immutable,
  Lols,
  Totems,
} from "../filters";
import type { Startable, UserFilter } from "../types";

export class CasServiceFactory {
  private readonly totemsRepo: TotemsRepo;
  private readonly lolsRepo: LolsUseridRepo;
  private readonly combotRepo: CombotUseridRepo;
  private readonly genericRepo: GenericUseridRepo;
  private readonly logger: Logger;

  constructor(config: {
    totemsRepo: TotemsRepo;
    lolsRepo: LolsUseridRepo;
    combotRepo: CombotUseridRepo;
    genericRepo: GenericUseridRepo;
    logger: Logger;
  }) {
    this.totemsRepo = config.totemsRepo;
    this.lolsRepo = config.lolsRepo;
    this.combotRepo = config.combotRepo;
    this.genericRepo = config.genericRepo;
    this.logger = config.logger;
  }

  public totems = () => {
    return new Totems(this.totemsRepo, this.logger);
  };

  public chain = (filters: (UserFilter & Startable)[]) => {
    return new FilterChain(filters, this.logger);
  };

  public generic = () => {
    return new Generic(this.genericRepo, this.logger);
  };

  public immutable = (filter: UserFilter & Startable) => {
    return new Immutable(filter);
  };

  public lols = () => {
    return new Lols(this.lolsRepo, this.logger);
  };

  public combot = () => {
    return new Combot(this.combotRepo, this.logger);
  };
}
