import { cleanEnv, host, port, str, url } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  HOST: host({ default: "0.0.0.0" }),
  OO_AUTH_CRED: str(),
  OO_BASE_URL: url(),
});
