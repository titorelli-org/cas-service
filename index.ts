import { logger, Service } from "./lib";
import { createCasService } from "./lib/createCasService";

new Service({
  cas: createCasService(logger),
  logger,
}).listen();
