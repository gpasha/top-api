import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getMongoConfig = async (
  configService: ConfigService,
  // eslint-disable-next-line @typescript-eslint/require-await
): Promise<MongooseModuleOptions> => {
  return {
    uri: getMongoString(configService),
    ...getMongoOptions(),
  };
};

const getMongoString = (configService: ConfigService) =>
  'mongodb://' +
  configService.get('MONGO_LOGIN') +
  ':' +
  configService.get('MONGO_PASSWORD') +
  '@' +
  configService.get('MONGO_HOST') +
  ':' +
  configService.get('MONGO_PORT') +
  '/' +
  configService.get('MONGO_AUTH_DB');

const getMongoOptions = () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
