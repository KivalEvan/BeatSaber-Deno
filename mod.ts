/**
 * Beat Saber general-purpose scripting module.
 *
 * This module provides beatmap schema, class object, and various toolings to handle Beat Saber map.
 * ```ts
 * import { globals, load, save } from "https://deno.land/x/bsmap@1.6.0/mod.ts";
 * globals.directory = '/path/to/map/folder/here'; // uses cwd if not stated
 * const data = load.difficultySync('ExpertStandard.dat', 3);
 * // ... do what you want here with `data`
 * save.difficultySync(data);
 * ```
 *
 * `globals` module only affects the root-level script and the script being run in the current process.
 *
 * `extensions` module is omitted from the main module as it is unstable and contain 3rd-party library.
 *
 * `patch` module is separated as it is non-essential and used to correct issues from existing beatmap.
 *
 * If you wish to only use schema, you are free to import `types` directly.
 *
 * @module
 */

export * from './beatmap/mod.ts';
export * as types from './types/mod.ts';
export * as convert from './converter/mod.ts';
export * as load from './load/mod.ts';
export * as save from './save/mod.ts';
export * as optimize from './optimize/mod.ts';
export * from './utils/mod.ts';
export { default as logger, Logger } from './logger.ts';
export { default as globals } from './globals.ts';
