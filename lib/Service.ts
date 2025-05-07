import type { Logger } from "pino";
import Leader from "mongo-lead";
import type { LeaderOptions } from "mongo-lead";
import fastify, { type FastifyInstance } from "fastify";
import type { CasService } from "./cas-service";
import casPlugin from "./fastify/plugins/cas";
import { MongoClient } from "mongodb";

import crypto from "crypto";

console.log(crypto.randomUUID());

export interface ServiceConfig {
  host: string;
  port: number;
  cas: CasService;
  logger: Logger;
  leaderOptions?: LeaderOptions & {
    mongoUri: string;
  };
}

export class Service {
  private readonly host: string;
  private readonly port: number;
  private readonly cas: CasService;
  private leader?: Leader;
  private readonly leaderOptions?: LeaderOptions & {
    mongoUri: string;
  };
  private readonly logger: Logger;
  private server: FastifyInstance;
  private readonly ready: Promise<void>;

  constructor({ cas, logger, leaderOptions, host, port }: ServiceConfig) {
    this.host = host;
    this.port = port;
    this.cas = cas;
    this.leaderOptions = leaderOptions;
    this.logger = logger;

    this.ready = this.initialize();
  }

  public async listen() {
    await this.ready;

    if (this.leader) {
      await this.leader?.start();

      const renew = () => {
        this.leader?.renew();

        setTimeout(renew, 700);
      };

      setTimeout(renew, 700);
    }

    await this.server.listen({ port: this.port, host: this.host });
  }

  private async initialize() {
    // @ts-expect-error 2322
    this.server = fastify({ loggerInstance: this.logger, trustProxy: true });

    if (this.leaderOptions) {
      const mongoConnection = await MongoClient.connect(
        this.leaderOptions.mongoUri,
      );
      const db = mongoConnection.db("titorelli");

      this.leader = new Leader(db, this.leaderOptions);

      this.leader.on("elected", () => {
        this.logger.info("Leader elected!");

        this.cas.start();
      });

      this.leader.on("revoked", () => {
        this.logger.info("Leader revoked!");

        this.cas.stop();
      });
    }

    await this.server.register(casPlugin, {
      cas: this.cas,
      logger: this.logger,
    });
  }
}
