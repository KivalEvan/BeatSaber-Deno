import { IInfoData } from './types/beatmap/shared/info.ts';
import { IDifficulty as DifficultyV2 } from './types/beatmap/v2/difficulty.ts';
import { IDifficulty as DifficultyV3 } from './types/beatmap/v3/difficulty.ts';
import { IOptimizeOptions, IOptimizeOptionsDifficulty, IOptimizeOptionsInfo } from './types/bsmap/optimize.ts';
import { Either } from './types/utils.ts';
import { round } from './utils/math.ts';
import logger from './logger.ts';
import { IBaseNote } from './types/beatmap/v3/baseNote.ts';

const tag = (name: string) => {
    return `[optimize::${name}]`;
};

const optionsInfo: Required<IOptimizeOptionsInfo> = {
    enabled: true,
    floatTrim: 4,
    stringTrim: true,
    throwError: true,
    removeDuplicate: true,
};
const optionsDifficulty: Required<IOptimizeOptionsDifficulty> = {
    enabled: true,
    floatTrim: 4,
    stringTrim: true,
    throwError: true,
    optimiseLight: false,
    sort: true,
};

/** Set default option value for optimize function. */
export const defaultOptions = {
    info: optionsInfo,
    difficulty: optionsDifficulty,
};

const ignoreObjectRemove = [
    '_notes',
    '_sliders',
    '_events',
    '_obstacles',
    '_waypoints',
    '_difficultyBeatmapSets',
    'bpmEvents',
    'rotationEvents',
    'colorNotes',
    'bombNotes',
    'obstacles',
    'sliders',
    'burstSliders',
    'waypoints',
    'basicBeatmapEvents',
    'colorBoostBeatmapEvents',
    'lightColorEventBoxGroups',
    'lightRotationEventBoxGroups',
    'basicEventTypesWithKeywords',
    'useNormalEventsAsCompatibleEvents',
    'd',
];
export function deepClean(
    // deno-lint-ignore no-explicit-any
    obj: { [key: string | number]: any } | any[],
    options: IOptimizeOptions,
    name = '',
) {
    for (const k in obj) {
        // shorten number
        if (typeof obj[k] === 'number') {
            obj[k] = round(obj[k], options.floatTrim);
        }
        // trim that string space
        if (typeof obj[k] === 'string' && options.stringTrim) {
            obj[k] = obj[k].trim();
        }
        // recursion
        if ((typeof obj[k] === 'object' || Array.isArray(obj[k])) && obj[k] !== null) {
            deepClean(obj[k], options, `${name}.${k}`);
            // if it's lightID array, sort it
            if (
                k === '_lightID' &&
                Array.isArray(obj[k]) &&
                // deno-lint-ignore no-explicit-any
                obj[k].every((x: any) => typeof x === 'number')
            ) {
                obj[k] = obj[k].sort((a: number, b: number) => a - b);
            }
        }
        // remove empty array/object property
        if (
            !ignoreObjectRemove.includes(k) &&
            ((Array.isArray(obj[k]) && !obj[k].length) ||
                (typeof obj[k] === 'object' && !Array.isArray(obj[k]) && JSON.stringify(obj[k]) === '{}'))
        ) {
            delete obj[k];
            continue;
        }
        // throw or remove null
        if (obj[k] === null) {
            if (options.throwError) {
                throw new Error(`null value found in object key ${name}.${k}.`);
            } else {
                if (Array.isArray(obj)) {
                    logger.error(tag('deepClean'), `null value found in array ${name}[${k}], defaulting to 0...`);
                    obj[k] = 0;
                } else {
                    logger.error(tag('deepClean'), `null value found in object key ${name}.${k}, deleting property...`);
                    delete obj[k];
                }
            }
        }
    }
}

export function info(info: IInfoData, options: IOptimizeOptionsInfo = { enabled: true }) {
    const opt: Required<IOptimizeOptionsInfo> = {
        enabled: options.enabled,
        floatTrim: options.floatTrim ?? defaultOptions.info.floatTrim,
        stringTrim: options.stringTrim ?? defaultOptions.info.stringTrim,
        throwError: options.throwError ?? defaultOptions.info.throwError,
        removeDuplicate: options.removeDuplicate ?? defaultOptions.info.removeDuplicate,
    };

    if (!opt.enabled) {
        return info;
    }
    logger.info(tag('info'), `Optimising info data`);

    logger.debug(tag('info'), 'Applying deep clean');
    deepClean(info, opt);
    return info;
}

export function difficulty(
    difficulty: Either<DifficultyV2, DifficultyV3>,
    options: IOptimizeOptionsDifficulty = { enabled: true },
) {
    const opt: Required<IOptimizeOptionsDifficulty> = {
        enabled: options.enabled,
        floatTrim: options.floatTrim ?? defaultOptions.difficulty.floatTrim,
        stringTrim: options.stringTrim ?? defaultOptions.difficulty.stringTrim,
        throwError: options.throwError ?? defaultOptions.difficulty.throwError,
        optimiseLight: options.optimiseLight ?? defaultOptions.difficulty.optimiseLight,
        sort: options.sort ?? defaultOptions.difficulty.sort,
    };

    if (!opt.enabled) {
        return difficulty;
    }
    logger.info(tag('difficulty'), `Optimising difficulty data`);

    logger.debug(tag('difficulty'), 'Applying deep clean');
    deepClean(difficulty, opt);

    if (opt.sort) {
        logger.debug(tag('difficulty'), 'Sorting objects');
        const sortPrec = Math.pow(10, opt.floatTrim);
        const sortV3Note = (a: IBaseNote, b: IBaseNote) => {
            if (a.customData?.coordinates && b.customData?.coordinates) {
                Math.round((a.b + Number.EPSILON) * sortPrec) / sortPrec -
                        Math.round((b.b + Number.EPSILON) * sortPrec) / sortPrec ||
                    a.customData.coordinates[0] - b.customData.coordinates[0] ||
                    a.customData.coordinates[1] - b.customData.coordinates[1];
            }
            return (
                Math.round((a.b + Number.EPSILON) * sortPrec) / sortPrec -
                    Math.round((b.b + Number.EPSILON) * sortPrec) / sortPrec ||
                a.x - b.x ||
                a.y - b.y
            );
        };
        difficulty._notes?.sort(
            (a, b) =>
                Math.round((a._time + Number.EPSILON) * sortPrec) / sortPrec -
                    Math.round((b._time + Number.EPSILON) * sortPrec) / sortPrec ||
                a._lineIndex - b._lineIndex ||
                a._lineLayer - b._lineLayer,
        );
        difficulty._obstacles?.sort((a, b) => a._time - b._time);
        difficulty._events?.sort((a, b) => a._time - b._time);
        difficulty.colorNotes?.sort(sortV3Note);
        difficulty.bombNotes?.sort(sortV3Note);
        difficulty.obstacles?.sort((a, b) => a.b - b.b);
        difficulty.bpmEvents?.sort((a, b) => a.b - b.b);
        difficulty.rotationEvents?.sort((a, b) => a.b - b.b);
        difficulty.colorBoostBeatmapEvents?.sort((a, b) => a.b - b.b);
        difficulty.basicBeatmapEvents?.sort((a, b) => a.b - b.b);
        difficulty.sliders?.sort(sortV3Note);
        difficulty.burstSliders?.sort(sortV3Note);
        difficulty.lightColorEventBoxGroups?.sort((a, b) => a.b - b.b);
        difficulty.lightRotationEventBoxGroups?.sort((a, b) => a.b - b.b);
        difficulty.waypoints?.sort(sortV3Note);

        difficulty.customData?.customEvents?.sort((a, b) => a.b - b.b);
        difficulty.customData?.fakeColorNotes?.sort(sortV3Note);
        difficulty.customData?.fakeBombNotes?.sort(sortV3Note);
        difficulty.customData?.fakeBurstSliders?.sort(sortV3Note);
        difficulty.customData?.fakeObstacles?.sort(sortV3Note);
    }

    return difficulty;
}
