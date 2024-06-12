import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Invite } from '../entities/invite';
import { Model } from 'mongoose';

@Injectable()
export class InviteService {
  constructor(
    @InjectModel(Invite.name) private readonly inviteModel: Model<Invite>,
  ) {}

  getCollection() {
    return this.inviteModel.collection;
  }

  findInviteLink(userId: string) {
    return this.inviteModel.findOne({ from: userId });
  }

  createInviteLink(userId: string) {
    return new this.inviteModel({
      from: userId,
      accepted_by: [],
    }).save();
  }
  async acceptInvite(userId: string, inviteId: string) {
    const invite = await this.inviteModel.findById(inviteId);
    if (!invite) throw new Error('Invite not found');
    invite.accepted_by.push(userId);
    return invite.save();
  }
}
