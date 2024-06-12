import { RouterModule } from '@nestjs/core';
import { ApiAuthModule } from './auth/api-auth.module';
import { ApiGameModule } from './game/api-game.module';
import { ApiStatModule } from './stat/api-stat.module';
import { ApiInviteModule } from './invite/api-invite.module';

export const ApiRouterModules = [
  ApiAuthModule,
  ApiGameModule,
  ApiStatModule,
  ApiInviteModule,
  RouterModule.register([
    { path: '/auth', module: ApiAuthModule },
    { path: '/stat', module: ApiStatModule },
    { path: '/game', module: ApiGameModule },
    { path: '/ref', module: ApiInviteModule },
  ]),
];
