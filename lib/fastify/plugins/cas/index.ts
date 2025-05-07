import fastifyPlugin from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";
import type { Logger } from "pino";
import { CasPlugin } from "./CasPlugin";
import type { CasService } from "../../../cas-service";

export interface CasPlugonOpts {
  cas: CasService;
  logger: Logger;
}

const casPlugin: FastifyPluginAsync<CasPlugonOpts> = async (
  fastify,
  { cas, logger },
) => {
  const plugin = new CasPlugin(fastify, cas, logger);

  await plugin.ready;
};

export default fastifyPlugin(casPlugin);
