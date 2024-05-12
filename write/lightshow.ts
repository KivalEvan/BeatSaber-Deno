// deno-lint-ignore-file no-explicit-any
import logger from '../logger.ts';
import type { IWrapBeatmap } from '../types/beatmap/wrapper/beatmap.ts';
import type { IWriteOptions } from '../types/mod.ts';
import { handleWrite, handleWriteSync, tag } from './_common.ts';

/**
 * Asynchronously write beatmap lightshow file.
 * ```ts
 * await writeLightshowFile(beatmap, 4);
 * ```
 */
export function writeLightshowFile(
   data: IWrapBeatmap,
   version: number,
   options?: IWriteOptions<IWrapBeatmap>,
): Promise<Record<string, any>> {
   logger.tInfo(tag('writeLightshowFile'), 'Async writing lightshow file');
   return handleWrite('lightshow', data, version, options);
}

/**
 * Synchronously write beatmap lightshow file.
 * ```ts
 * writeLightshowFileSync(beatmap, 4);
 * ```
 */
export function writeLightshowFileSync(
   data: IWrapBeatmap,
   version: number,
   options?: IWriteOptions<IWrapBeatmap>,
): Record<string, any> {
   logger.tInfo(tag('writeLightshowFileSync'), 'Sync writing lightshow file');
   return handleWriteSync('lightshow', data, version, options);
}