import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreModules } from './core/modules';
import { ApiRouterModules } from './api/router';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://maxim:12evr4r@cluster.8caidnj.mongodb.net/local-no-think?retryWrites=true&w=majority',
    ),
    ...CoreModules,
    ...ApiRouterModules,
  ],
})
export class AppModule {}
