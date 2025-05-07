import type { Logger } from "pino";
import type { CasService } from "./cas-service";
import fastify, { type FastifyInstance } from "fastify";
import casPlugin from "./fastify/plugins/cas";

export interface ServiceConfig {
  host: string;
  port: number;
  cas: CasService;
  logger: Logger;
}

export class Service {
  private readonly host: string;
  private readonly port: number;
  private readonly cas: CasService;
  private readonly logger: Logger;
  private server: FastifyInstance;
  private readonly ready: Promise<void>;

  constructor({ cas, logger, host, port }: ServiceConfig) {
    this.host = host;
    this.port = port;
    this.cas = cas;
    this.logger = logger;

    this.ready = this.initialize();
  }

  public async listen() {
    await this.ready;

    await this.server.listen({ port: this.port, host: this.host });
  }

  private async initialize() {
    // @ts-expect-error 2322
    this.server = fastify({ loggerInstance: this.logger, trustProxy: true });

    await this.server.register(casPlugin, {
      cas: this.cas,
      logger: this.logger,
    });
  }
}
