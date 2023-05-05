import { IDifficulty } from '../../types/beatmap/v1/difficulty.ts';
import { Difficulty } from './difficulty.ts';
import { deepCheck } from '../shared/dataCheck.ts';
import { DifficultyCheck } from './dataCheck.ts';
import logger from '../../logger.ts';
import { IBaseObject } from '../../types/beatmap/v1/object.ts';

const tag = (name: string) => {
    return `[v1::parse::${name}]`;
};

const sortObjectTime = (a: IBaseObject, b: IBaseObject) => a._time - b._time;

export function difficulty(
    data: Partial<IDifficulty>,
    checkData: {
        enable: boolean;
        throwError?: boolean;
    } = { enable: true, throwError: true },
): Difficulty {
    logger.info(tag('difficulty'), 'Parsing beatmap difficulty v1.x.x');
    if (!data._version?.startsWith('1')) {
        logger.warn(tag('difficulty'), 'Unidentified beatmap version');
        data._version = '1.5.0';
    }
    if (checkData.enable) {
        deepCheck(data, DifficultyCheck, 'difficulty', data._version, checkData.throwError);
    }

    data._notes = data._notes ?? [];
    data._obstacles = data._obstacles ?? [];
    data._events = data._events ?? [];

    data._notes.sort(sortObjectTime);
    data._obstacles.sort(sortObjectTime);
    data._events.sort(sortObjectTime);

    return new Difficulty(data);
}