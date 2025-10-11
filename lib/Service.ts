import type { Logger } from "pino";
import Leader from "mongo-lead";
import { MongoClient } from "mongodb";
import type { LeaderOptions } from "mongo-lead";
import fastify, { type FastifyInstance } from "fastify";
import { oidcProvider } from "@titorelli-org/fastify-oidc-provider";
import {
  protectedRoutes,
  TokenValidator,
} from "@titorelli-org/fastify-protected-routes";
import type { JwksStore } from "@titorelli-org/jwks-store";
import type { CasService } from "./cas-service";
import casPlugin from "./fastify/plugins/cas";
import { env } from "./env";

export interface ServiceConfig {
  host: string;
  port: number;
  cas: CasService;
  jwksStore: JwksStore;
  logger: Logger;
  leaderOptions?:
    | null
    | (LeaderOptions & {
        mongoUri: string;
      });
}

export class Service {
  private readonly host: string;
  private readonly port: number;
  private readonly cas: CasService;
  private leader?: Leader;
  private readonly leaderOptions?:
    | null
    | (LeaderOptions & {
        mongoUri: string;
      });
  private readonly jwksStore: JwksStore;
  private readonly logger: Logger;
  private server: FastifyInstance;
  private readonly ready: Promise<void>;

  constructor({
    cas,
    logger,
    leaderOptions,
    host,
    port,
    jwksStore,
  }: ServiceConfig) {
    this.host = host;
    this.port = port;
    this.cas = cas;
    this.leaderOptions = leaderOptions;
    this.jwksStore = jwksStore;
    this.logger = logger;

    this.ready = this.initialize();
  }

  public async listen() {
    await this.ready;

    if (this.leader) {
      await this.leader?.start();
    }

    await this.server.listen({ port: this.port, host: this.host });
  }

  private async initialize() {
    // @ts-expect-error 2322
    this.server = fastify({ loggerInstance: this.logger, trustProxy: true });

    await this.server.register(oidcProvider, {
      origin: env.CAS_ORIGIN,
      jwksStore: this.jwksStore,
      initialAccessToken: env.INITIAL_ACCESS_TOKEN,
      logger: this.logger,
    });

    const tokenValidator = new TokenValidator({
      jwksStore: this.jwksStore,
      apiTokens: {
        enable: true,
        jwtSecret: env.JWT_SECRET,
      },
      testSubject: () => true,
      testAudience: () => true,
      logger: this.logger,
    });

    await this.server.register(protectedRoutes, {
      origin: env.CAS_ORIGIN,
      authorizationServers: [`${env.CAS_ORIGIN}/oidc`],
      allRoutesRequireAuthorization: true,
      logger: this.logger,
      async checkToken(token, url, scopes) {
        return tokenValidator.validate(token, url, scopes);
      },
    });

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
