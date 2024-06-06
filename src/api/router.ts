import { RouterModule } from '@nestjs/core';
import { ApiAuthModule } from './auth/api-auth.module';
import { ApiGameModule } from './game/api-game.module';
import { ApiStatModule } from './stat/api-stat.module';

export const ApiRouterModules = [
  ApiAuthModule,
  ApiGameModule,
  ApiStatModule,
  RouterModule.register([
    { path: '/auth', module: ApiAuthModule },
    { path: '/stat', module: ApiStatModule },
    { path: '/game', module: ApiGameModule },
  ]),
];
