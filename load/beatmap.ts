import type { IBeatmapData } from '../types/bsmap/beatmap.ts';
import globals from '../globals.ts';
import logger from '../logger.ts';
import type { ILoadOptionsDifficulty } from '../types/bsmap/load.ts';
import { resolve } from '../deps.ts';
import type { IWrapInfo } from '../types/beatmap/wrapper/info.ts';
import { defaultOptions } from './options.ts';
import { readJSONFile, readJSONFileSync } from '../utils/_fs.ts';
import { _difficulty } from './difficulty.ts';

function tag(name: string): string[] {
   return ['load', name];
}

/**
 * Asynchronously load multiple beatmap difficulties given beatmap info.
 *
 * Automatically omits difficulty that could not be loaded or does not exist.
 * ```ts
 * load.beatmapFromInfo().then((data) => data.forEach((d) => console.log(d)));
 * ```
 *
 * Info difficulty reference is also given to allow further control.
 */
export function beatmapFromInfo(
   info: IWrapInfo,
   options: ILoadOptionsDifficulty = {},
): Promise<IBeatmapData[]> {
   logger.tInfo(tag('beatmapFromInfo'), 'Async loading difficulty from info');
   const opt: Required<ILoadOptionsDifficulty> = {
      directory: options.directory ??
         (globals.directory || defaultOptions.list.directory),
      forceConvert: options.forceConvert ?? defaultOptions.list.forceConvert,
      dataCheck: {
         ...defaultOptions.list.dataCheck,
         ...options.dataCheck,
      },
      sort: options.sort ?? defaultOptions.list.sort,
      preprocess: options.preprocess ?? defaultOptions.list.preprocess,
      postprocess: options.postprocess ?? defaultOptions.list.postprocess,
   };
   return Promise.all(
      info.listMap().map(async ([_, beatmapInfo]) => {
         let p;
         try {
            p = resolve(opt.directory, beatmapInfo.filename);
            const json = await readJSONFile(p);

            const jsonVerStr = typeof json._version === 'string'
               ? json._version.at(0)
               : typeof json.version === 'string'
               ? json.version.at(0)
               : null;
            let jsonVer: number;
            if (jsonVerStr) {
               jsonVer = parseInt(jsonVerStr);
            } else {
               jsonVer = 2;
            }

            const data = _difficulty(json, beatmapInfo.filename, jsonVer, opt);
            return {
               settings: beatmapInfo,
               version: jsonVer,
               data: data,
            };
         } catch {
            logger.tWarn(
               tag('beatmapFromInfo'),
               `Could not load difficulty from ${p}, skipping...`,
            );
         }
      }),
   ).then((d) => d.filter((e) => e) as IBeatmapData[]);
}

/**
 * Synchronously load multiple beatmap difficulties given beatmap info.
 *
 * Automatically omits difficulty that could not be loaded or does not exist.
 * ```ts
 * const difficultyList = load.beatmapFromInfoSync();
 * difficultyList.forEach((d) => console.log(d));
 * ```
 *
 * Info difficulty reference is also given to allow further control.
 */
export function beatmapFromInfoSync(
   info: IWrapInfo,
   options: ILoadOptionsDifficulty = {},
): IBeatmapData[] {
   logger.tInfo(
      tag('beatmapFromInfoSync'),
      'Sync loading difficulty from info',
   );
   const opt: Required<ILoadOptionsDifficulty> = {
      directory: options.directory ??
         (globals.directory || defaultOptions.list.directory),
      forceConvert: options.forceConvert ?? defaultOptions.list.forceConvert,
      dataCheck: options.dataCheck ?? defaultOptions.list.dataCheck,
      sort: options.sort ?? defaultOptions.list.sort,
      preprocess: options.preprocess ?? defaultOptions.list.preprocess,
      postprocess: options.postprocess ?? defaultOptions.list.postprocess,
   };
   return info
      .listMap()
      .map(([_, beatmapInfo]) => {
         let p;
         try {
            p = resolve(opt.directory, beatmapInfo.filename);
            const json = readJSONFileSync(p);

            const jsonVerStr = typeof json._version === 'string'
               ? json._version.at(0)
               : typeof json.version === 'string'
               ? json.version.at(0)
               : null;
            let jsonVer: number;
            if (jsonVerStr) {
               jsonVer = parseInt(jsonVerStr);
            } else {
               jsonVer = 2;
            }

            const data = _difficulty(json, beatmapInfo.filename, jsonVer, opt);
            return {
               settings: beatmapInfo,
               version: jsonVer,
               data: data,
            };
         } catch {
            logger.tWarn(
               tag('beatmapFromInfoSync'),
               `Could not load difficulty from ${p}, skipping...`,
            );
         }
      })
      .filter((e) => e) as IBeatmapData[];
}
