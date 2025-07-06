import { bool, cleanEnv, host, port, str, url } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  HOST: host({ default: "0.0.0.0" }),
  CAS_ORIGIN: url(),
  OO_AUTH_CRED: str(),
  OO_BASE_URL: url(),
  MONGO_URL: url({ default: "mongodb://localhost:27017/" }),
  FEAT_LEADER: bool({ default: true }),
});
