import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const isDevelopment = configService.get('NODE_ENV') === 'development';

    const store = await redisStore({
      url: configService.get('REDIS_URL'),
      socket: {
        connectTimeout: 5000,
        tls: !isDevelopment,
        ...(!isDevelopment
          ? { ca: [configService.get('REDIS_CA_CERT') as string] }
          : {}),
      },
    });

    return {
      store: () => store,
    };
  },
};
