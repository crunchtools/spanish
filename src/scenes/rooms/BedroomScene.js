import { RoomBase } from './RoomBase.js';
import { rooms } from '../../config/vocabulary.js';

export class BedroomScene extends RoomBase {
  constructor(game) {
    super(game, rooms.bedroom);
  }
}
