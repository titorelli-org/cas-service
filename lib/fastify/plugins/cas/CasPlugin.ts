import { FastifyInstance } from "fastify";
import { CasService } from "../../../cas-service";
import { Logger } from "pino";

export class CasPlugin {
  public readonly ready: Promise<void>;

  constructor(
    private service: FastifyInstance,
    private cas: CasService,
    private logger: Logger,
  ) {
    this.ready = this.initialize();
  }

  private async initialize() {
    this.service.get<{
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
        console.time(`isBanned(${tgUserId})`);

        const result = await this.cas.isBanned(tgUserId);

        console.timeEnd(`isBanned(${tgUserId})`);

        return result;
      },
    );

    this.service.post<{
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
          await this.cas.ban(tgUserId);
        } else {
          await this.cas.protect(tgUserId);
        }
      },
    );
  }
}
