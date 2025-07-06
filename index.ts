import { JwksStore } from "@titorelli-org/jwks-store";
import { env, logger, Service } from "./lib";
import { createCasService } from "./lib";

import crypto from "node:crypto";
import path from "node:path";

Reflect.set(crypto, "default", crypto);

new Service({
  host: env.HOST,
  port: env.PORT,
  cas: createCasService(logger),
  jwksStore: new JwksStore(path.join(__dirname, "data/jwks.json")),
  leaderOptions: env.FEAT_LEADER
    ? {
        mongoUri: env.MONGO_URL,
        collectionName: "cas-leader",
        groupName: "titorelli-cas",
      }
    : null,
  logger,
}).listen();
