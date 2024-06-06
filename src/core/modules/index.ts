import { AuthModule } from './auth/auth.module';
import { UserModule } from './auth/modules/user/user.module';

export const CoreModules = [UserModule, AuthModule];
