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

  async getInvited(userId: string): Promise<string[]> {
    const invite = await this.inviteModel.findOne({ from: userId });
    return invite.accepted_by.map((id) => id.toString());
  }
  async acceptInvite(userId: string, inviteId: string) {
    const invite = await this.inviteModel.findById(inviteId);
    if (!invite) throw new Error('Invite not found');
    if (userId === invite.from.toString())
      throw new Error('Cannot invite your self');
    invite.accepted_by.push(userId);
    return invite.save();
  }
  async getUserIdByInviteId(inviteId: string) {
    const invite = await this.inviteModel.findById(inviteId);
    if (!invite) throw new Error('Invite not found');
    return invite.from;
  }

  async claim(userId: string) {
    const invite = await this.inviteModel.findOne({ from: userId });
    if (!invite) return 0;
    const diff = invite.accepted_by.length - (invite.claimed || 0);
    invite.claimed = invite.accepted_by.length;
    await invite.save();
    return diff;
  }
}
