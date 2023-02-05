import * as Joi from 'joi';
import { DEFAULT_APP_HOST, DEFAULT_APP_PORT } from 'src/const/common';

export const configModuleOptions = {
  isGlobal: true,
  validationSchema: Joi.object({
    APP_HOST: Joi.string().default(DEFAULT_APP_HOST),
    APP_PORT: Joi.number().default(DEFAULT_APP_PORT),
    MONGO_USERNAME: Joi.string().required(),
    MONGO_PASSWORD: Joi.string().required(),
    MONGO_DATABASE: Joi.string().required(),
    MONGO_HOST: Joi.string().required(),
    CRYPT_SALT: Joi.number().required(),
    JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
    JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
    ALLOWED_ORIGIN: Joi.string().required(),
  }),
  validationOptions: {
    abortEarly: true,
  },
};
