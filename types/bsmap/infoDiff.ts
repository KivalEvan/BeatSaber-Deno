import { CharacteristicName } from '../beatmap/shared/characteristic.ts';
import { DifficultyName } from '../beatmap/shared/difficulty.ts';
import { IWrapInfoDifficulty } from '../beatmap/wrapper/info.ts';
import { Difficulty as DifficultyV1 } from '../../beatmap/v1/difficulty.ts';
import { Difficulty as DifficultyV2 } from '../../beatmap/v2/difficulty.ts';
import { Difficulty as DifficultyV3 } from '../../beatmap/v3/difficulty.ts';
import { IWrapDifficulty } from '../beatmap/wrapper/difficulty.ts';

interface ILoadInfoDataBase {
   readonly characteristic: CharacteristicName;
   readonly difficulty: DifficultyName;
   readonly settings: IWrapInfoDifficulty;
   data: IWrapDifficulty;
}

interface ILoadInfoDifficultyV1 extends ILoadInfoDataBase {
   version: 1;
   data: DifficultyV1;
}

interface ILoadInfoDifficultyV2 extends ILoadInfoDataBase {
   version: 2;
   data: DifficultyV2;
}

interface ILoadInfoDifficultyV3 extends ILoadInfoDataBase {
   version: 3;
   data: DifficultyV3;
}

export type ILoadInfoData = ILoadInfoDifficultyV1 | ILoadInfoDifficultyV2 | ILoadInfoDifficultyV3;