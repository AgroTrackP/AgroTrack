import { config as dotenvConfig } from 'dotenv';
import { ConfigParams } from 'express-openid-connect';
dotenvConfig({ path: '.env.development' });

export const config: ConfigParams = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET!,
  baseURL: process.env.AUTH0_AUDIENCE!,
  clientID: process.env.AUTH0_CLIENT_ID!,
  issuerBaseURL: process.env.AUTH0_BASE_URL!,
};
