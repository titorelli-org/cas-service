import fastify from "fastify";
import {
  CasService,
  FilterChain,
  Totems,
  Lols,
  Combot,
  totemsRepo,
  lolsRepo,
  combotRepo,
} from "./lib";
import { logger } from "./lib/logger";

const service = new CasService(
  new Totems(totemsRepo),
  new FilterChain(
    [new Lols(lolsRepo, logger), new Combot(combotRepo, logger)],
    logger,
  ),
  logger,
);
const server = fastify({ loggerInstance: logger });

server.get<{
  Querystring: {
    tgUserId: number;
  };
}>(
  "/isBanned",
  {
    schema: {
      querystring: {
        type: "object",
        required: ["tgUserId"],
        properties: {
          tgUserId: { type: "number" },
        },
      },
    },
  },
  async ({ query: { tgUserId } }) => {
    return {
      banned: await service.isBanned(tgUserId),
    };
  },
);

server.post<{
  Body: {
    tgUserId: number;
    banned: boolean;
  };
}>(
  "/train",
  {
    schema: {
      body: {
        type: "object",
        required: ["tgUserId", "banned"],
        properties: {
          tgUserId: { type: "number" },
          banned: { type: "boolean" },
        },
      },
    },
  },
  async ({ body: { tgUserId, banned } }) => {
    if (banned) {
      await service.ban(tgUserId);
    } else {
      await service.protect(tgUserId);
    }
  },
);

server.listen({
  port: Number(process.env.PORT ?? 3000),
  host: process.env.HOST ?? "0.0.0.0",
});
