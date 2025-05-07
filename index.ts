import { env, logger, Service } from "./lib";
import { createCasService } from "./lib/createCasService";

new Service({
  host: env.HOST,
  port: env.PORT,
  cas: createCasService(logger),
  logger,
}).listen();
