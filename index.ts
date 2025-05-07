import { env, logger, Service } from "./lib";
import { createCasService } from "./lib";

import crypto from "node:crypto";

Reflect.set(crypto, "default", crypto);

new Service({
  host: env.HOST,
  port: env.PORT,
  cas: createCasService(logger),
  // leaderOptions: {
  //   mongoUri: env.MONGO_URL,
  //   collectionName: "cas-leader",
  //   groupName: "titorelli-cas",
  // },
  logger,
}).listen();
