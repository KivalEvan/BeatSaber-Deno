import { INote } from './note.ts';
import { IObstacle } from './obstacle.ts';
import { IEvent } from './event.ts';
import { ICustomDifficulty } from './custom/difficulty.ts';

/** Difficulty interface for difficulty file. */
export interface IDifficulty extends ICustomDifficulty {
   _version: '1.5.0';
   _beatsPerMinute: number;
   _beatsPerBar: number;
   _shuffle: number;
   _shufflePeriod: number;
   _noteJumpSpeed: number;
   _noteJumpStartBeatOffset: number;
   _events: IEvent[];
   _notes: INote[];
   _obstacles: IObstacle[];
}
