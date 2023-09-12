// deno-lint-ignore-file require-await
import {
   ISaveOptionsDifficulty,
   ISaveOptionsDifficultyList,
   ISaveOptionsInfo,
} from './types/bsmap/save.ts';
import { ILoadInfoData } from './types/bsmap/infoDiff.ts';
import * as optimize from './optimize.ts';
import globals from './globals.ts';
import logger from './logger.ts';
import { deepCheck } from './beatmap/shared/dataCheck.ts';
import {
   DifficultyCheck as V1DifficultyCheck,
   InfoCheck as IV1nfoCheck,
} from './beatmap/v1/dataCheck.ts';
import {
   DifficultyCheck as V2DifficultyCheck,
   InfoCheck as IV2nfoCheck,
} from './beatmap/v2/dataCheck.ts';
import { DifficultyCheck as V3DifficultyCheck } from './beatmap/v3/dataCheck.ts';
import { IDifficulty as IV2Difficulty } from './types/beatmap/v2/difficulty.ts';
import { Info as IV2nfo } from './beatmap/v2/info.ts';
import { IWrapInfo } from './types/beatmap/wrapper/info.ts';
import { IWrapDifficulty } from './types/beatmap/wrapper/difficulty.ts';
import { resolve } from './deps.ts';
import { IInfo } from './types/beatmap/v2/info.ts';

function tag(name: string): string[] {
   return ['save', name];
}

const optionsInfo: Required<ISaveOptionsInfo> = {
   directory: '',
   filePath: 'Info.dat',
   format: 0,
   optimize: { enabled: true },
   validate: { enabled: true, reparse: true },
   dataCheck: {
      enabled: true,
      throwError: true,
   },
};

const optionsDifficulty: Required<ISaveOptionsDifficulty> = {
   directory: '',
   filePath: 'UnnamedPath.dat',
   format: 0,
   optimize: { enabled: true },
   validate: { enabled: true, reparse: true },
   dataCheck: {
      enabled: true,
      throwError: true,
   },
};

const optionsDifficultyList: Required<ISaveOptionsDifficultyList> = {
   directory: '',
   format: 0,
   optimize: { enabled: true },
   validate: { enabled: true, reparse: true },
   dataCheck: {
      enabled: true,
      throwError: true,
   },
};

/** Set default option value for save function. */
export const defaultOptions = {
   info: optionsInfo,
   difficulty: optionsDifficulty,
   difficultyList: optionsDifficultyList,
};

function _info(data: IWrapInfo, options: ISaveOptionsInfo) {
   const opt: Required<ISaveOptionsInfo> = {
      directory: options.directory ?? (globals.directory || defaultOptions.info.directory),
      filePath: options.filePath ?? (defaultOptions.info.filePath || 'Info.dat'),
      format: options.format ?? defaultOptions.info.format,
      optimize: options.optimize ?? defaultOptions.info.optimize,
      validate: options.validate ?? defaultOptions.info.validate,
      dataCheck: options.dataCheck ?? defaultOptions.info.dataCheck,
   };
   const ver = data instanceof IV2nfo ? 2 : 1;
   const objectData = data.toJSON();
   if (opt.optimize.enabled) {
      optimize.info(objectData as IInfo, opt.optimize);
   }
   if (opt.dataCheck.enabled) {
      logger.tInfo(tag('_info'), 'Checking data value');
      if (ver === 1) {
         deepCheck(objectData, IV1nfoCheck, 'difficulty', '1.0.0', opt.dataCheck.throwError);
      }
      if (ver === 2) {
         deepCheck(objectData, IV2nfoCheck, 'difficulty', '2.2.0', opt.dataCheck.throwError);
      }
   }
   const p = resolve(opt.directory, opt.filePath);
   logger.tInfo(tag('_info'), `Writing to ${p}`);
   Deno.writeTextFileSync(
      p,
      opt.format ? JSON.stringify(objectData, null, opt.format) : JSON.stringify(objectData),
   );
}

/**
 * Asynchronously save beatmap info.
 * ```ts
 * await save.info(info);
 * ```
 */
export async function info(data: IWrapInfo, options: ISaveOptionsInfo = {}) {
   logger.tInfo(tag('info'), `Async saving info`);
   _info(data, options);
}

/**
 * Synchronously save beatmap info.
 * ```ts
 * save.infoSync(info);
 * ```
 */
export function infoSync(data: IWrapInfo, options: ISaveOptionsInfo = {}) {
   logger.tInfo(tag('infoSync'), `Sync saving info`);
   _info(data, options);
}

function _difficulty(data: IWrapDifficulty, options: ISaveOptionsDifficulty) {
   const opt: Required<ISaveOptionsDifficulty> = {
      directory: options.directory ?? (globals.directory || defaultOptions.difficulty.directory),
      filePath: options.filePath ??
         (data.filename || defaultOptions.difficulty.filePath || 'UnnamedDifficulty.dat'),
      format: options.format ?? defaultOptions.difficulty.format,
      optimize: options.optimize ?? defaultOptions.difficulty.optimize,
      validate: options.validate ?? defaultOptions.difficulty.validate,
      dataCheck: options.dataCheck ?? defaultOptions.difficulty.dataCheck,
   };
   if (opt.validate.enabled) {
      logger.tInfo(tag('_difficulty'), 'Validating beatmap');
      if (!data.isValid()) {
         logger.tWarn(tag('_difficulty'), 'Invalid data detected in beatmap');
         if (opt.validate.reparse) {
            data.reparse();
         } else {
            throw new Error('Preventing save of beatmap');
         }
      }
   }
   const ver = data.version;
   const objectData = data.toJSON();
   if (opt.optimize.enabled) {
      optimize.difficulty(objectData as IV2Difficulty, opt.optimize);
   }
   if (opt.dataCheck.enabled) {
      logger.tInfo(tag('_difficulty'), 'Checking data value');
      if (ver.startsWith('1')) {
         deepCheck(objectData, V1DifficultyCheck, 'difficulty', ver, opt.dataCheck.throwError);
      }
      if (ver.startsWith('2')) {
         deepCheck(objectData, V2DifficultyCheck, 'difficulty', ver, opt.dataCheck.throwError);
      }
      if (ver.startsWith('3')) {
         deepCheck(objectData, V3DifficultyCheck, 'difficulty', ver, opt.dataCheck.throwError);
      }
   }
   const p = resolve(opt.directory, opt.filePath);
   logger.tInfo(tag('_difficulty'), `Writing to ${p}`);
   Deno.writeTextFileSync(
      p,
      opt.format ? JSON.stringify(objectData, null, opt.format) : JSON.stringify(objectData),
   );
}

/**
 * Asynchronously save beatmap difficulty.
 * ```ts
 * await save.difficulty(difficulty);
 * ```
 */
export async function difficulty(data: IWrapDifficulty, options: ISaveOptionsDifficulty = {}) {
   logger.tInfo(tag('difficulty'), `Async saving difficulty`);
   _difficulty(data, options);
}

/**
 * Synchronously save beatmap difficulty.
 * ```ts
 * save.difficultySync(difficulty);
 * ```
 */
export function difficultySync(data: IWrapDifficulty, options: ISaveOptionsDifficulty = {}) {
   logger.tInfo(tag('difficultySync'), `Sync saving difficulty`);
   _difficulty(data, options);
}

function _difficultyList(difficulties: ILoadInfoData[], options: ISaveOptionsDifficultyList) {
   const opt: Required<ISaveOptionsDifficultyList> = {
      directory: options.directory ??
         (globals.directory || defaultOptions.difficultyList.directory),
      format: options.format ?? defaultOptions.difficultyList.format,
      optimize: options.optimize ?? defaultOptions.difficultyList.optimize,
      validate: options.validate ?? defaultOptions.difficultyList.validate,
      dataCheck: options.dataCheck ?? defaultOptions.difficultyList.dataCheck,
   };
   difficulties.forEach((dl) => {
      logger.tInfo(tag('_difficultyList'), `Saving ${dl.characteristic} ${dl.difficulty}`);
      if (opt.validate.enabled) {
         logger.tInfo(tag('_difficultyList'), 'Validating beatmap');
         if (!dl.data.isValid()) {
            logger.tWarn(tag('_difficultyList'), 'Invalid data detected in beatmap');
            if (opt.validate.reparse) {
               dl.data.reparse();
            } else {
               throw new Error('Preventing save of beatmap');
            }
         }
      }
      const ver = dl.data.version;
      const objectData = dl.data.toJSON();
      if (opt.optimize.enabled) {
         optimize.difficulty(objectData, opt.optimize);
      }
      if (opt.dataCheck.enabled) {
         logger.tInfo(tag('_difficultyList'), 'Checking data value');
         if (ver.startsWith('1')) {
            deepCheck(objectData, V1DifficultyCheck, 'difficulty', ver, opt.dataCheck.throwError);
         }
         if (ver.startsWith('2')) {
            deepCheck(objectData, V2DifficultyCheck, 'difficulty', ver, opt.dataCheck.throwError);
         }
         if (ver.startsWith('3')) {
            deepCheck(objectData, V3DifficultyCheck, 'difficulty', ver, opt.dataCheck.throwError);
         }
      }
      const p = resolve(opt.directory, dl.settings.filename);
      logger.tInfo(tag('_difficultyList'), `Writing to ${p}`);
      Deno.writeTextFileSync(
         p,
         opt.format ? JSON.stringify(objectData, null, opt.format) : JSON.stringify(objectData),
      );
   });
}

/**
 * Asynchronously save multiple beatmap difficulties.
 * ```ts
 * await save.difficultyList(difficulties);
 * ```
 */
export async function difficultyList(
   difficulties: ILoadInfoData[],
   options: ISaveOptionsDifficultyList = {},
) {
   logger.tInfo(tag('difficultyList'), `Async saving list of difficulty`);
   _difficultyList(difficulties, options);
}

/**
 * Synchronously save multiple beatmap difficulties.
 * ```ts
 * save.difficultyList(difficulties);
 * ```
 */
export function difficultyListSync(
   difficulties: ILoadInfoData[],
   options: ISaveOptionsDifficultyList = {},
) {
   logger.tInfo(tag('difficultyListSync'), `Sync saving list of difficulty`);
   _difficultyList(difficulties, options);
}
