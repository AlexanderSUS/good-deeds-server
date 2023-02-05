export enum EnvVariables {
  mongoUserName = 'MONGO_USERNAME',
  mongoPassword = 'MONGO_PASSWORD',
  mongoDatabase = 'MONGO_DATABASE',
  mongoHost = 'MONGO_HOST',
  appHost = 'APP_HOST',
  appPort = 'APP_PORT',
  cryptSalt = 'CRYPT_SALT',
  accessTokenSecret = 'JWT_ACCESS_TOKEN_SECRET',
  accessExpiration = 'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
  refreshSecret = 'JWT_REFRESH_TOKEN_SECRET',
  refreshExpiration = 'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
  allowedOrigin = 'ALLOWED_ORIGIN',
}
