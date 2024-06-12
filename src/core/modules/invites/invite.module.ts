import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invite, inviteSchema } from './entities/invite';
import { InviteService } from './services/invite.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invite.name, schema: inviteSchema }]),
  ],
  providers: [InviteService],
  exports: [InviteService],
})
export class InviteModule {}
