import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './entities/game';
import { Model } from 'mongoose';
import { GameSnapshot } from './entities/game.snapshot';
import { SyncStateDto } from 'src/api/game/dto/sync.state.dto';

@Injectable()
export class GameService {
  private logger = new Logger(GameService.name);
  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<Game>,
    @InjectModel(GameSnapshot.name)
    private readonly gameSnapshotModel: Model<GameSnapshot>,
  ) {}

  findGame(gameId: string) {
    return this.gameModel.findById(gameId);
  }

  getTopScoredGames() {
    return this.gameModel.find({}).sort('score').limit(100);
  }

  getScore() {
    return this.gameModel.find({}).select('score');
  }

  getCollection() {
    return this.gameModel.collection;
  }

  createGame(data: { score: number; clicks: number }) {
    const instance = new this.gameModel({
      energy: 100,
      max_energy: 100,
      score: data.score || 0,
      multiplier: 1,
      tap_value: 1,
    });
    return instance.save();
  }

  async sync(gameId: string, data: SyncStateDto) {
    const game = await this.gameModel.findById(gameId);
    let gameSnapshot = await this.gameSnapshotModel.findOne({
      game_id: gameId,
    });
    if (!game) {
      throw new Error('Game not found');
    }
    if (!gameSnapshot) {
      gameSnapshot = new this.gameSnapshotModel();
    }
    gameSnapshot.game = game.toObject();
    gameSnapshot.game_id = game;
    this.logger.log(`${data.score} -> ${game.score}`);
    game.score += data.score;
    this.logger.log(`${game.score}`);
    game.energy = data.energy;
    game.updated_at = new Date();
    await game.save();
    await gameSnapshot.save();
    return game;
  }
}
