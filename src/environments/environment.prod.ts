import { secrets } from "./environment.secrets";

export const environment = {
  production: true,
  apiUrl: secrets.prodUrl,
};