import type {
   InferBeatmapSourceVersion,
   InferBeatmapVersion,
   InferBeatmapWrapper,
} from '../schema/shared/types/infer.ts';
import type { BeatmapFileType } from '../schema/shared/types/schema.ts';
import { toV1Beatmap } from '../converter/toV1/beatmap.ts';
import { toV1Info } from '../converter/toV1/info.ts';
import { toV2AudioData } from '../converter/toV2/audioData.ts';
import { toV2Beatmap } from '../converter/toV2/beatmap.ts';
import { toV2Info } from '../converter/toV2/info.ts';
import { toV3Beatmap } from '../converter/toV3/beatmap.ts';
import { toV4AudioData } from '../converter/toV4/audioData.ts';
import { toV4Beatmap } from '../converter/toV4/beatmap.ts';
import { toV4Info } from '../converter/toV4/info.ts';
import { isSupportedMajorVersion } from '../helpers/version.ts';
import { getLogger } from '../../logger.ts';

function tag(...rest: string[]): string[] {
   return ['process', ...rest];
}

type ConverterMap<T extends BeatmapFileType> = {
   [TVersion in InferBeatmapVersion<T>]: <TWrapper extends InferBeatmapWrapper<T>>(
      data: TWrapper,
      fromVersion?: number,
   ) => TWrapper;
};

function resolveConverter<
   TFileType extends BeatmapFileType,
   TVersion extends InferBeatmapVersion<TFileType>,
>(
   map: ConverterMap<TFileType>,
   type: TFileType,
   version: TVersion,
): ConverterMap<TFileType>[TVersion] {
   const convert = map[version];
   if (!convert) {
      throw new Error(
         `Unsupported ${type} beatmap version ${version}, found no matching converter.`,
      );
   }
   return convert;
}

/** Conversion function version map for beatmap info. */
export const infoConvertMap: ConverterMap<'info'> = {
   1: toV1Info,
   2: toV2Info,
   4: toV4Info,
} as const satisfies ConverterMap<'info'>;

/** Conversion function version map for beatmap audio data. */
export const audioDataConvertMap: ConverterMap<'audioData'> = {
   2: toV2AudioData,
   4: toV4AudioData,
} as const satisfies ConverterMap<'audioData'>;

/** Conversion function version map for beatmap data. */
export const beatmapConvertMap: ConverterMap<'difficulty' | 'lightshow'> = {
   1: toV1Beatmap,
   2: toV2Beatmap,
   3: toV3Beatmap,
   4: toV4Beatmap,
} as const satisfies ConverterMap<'difficulty' | 'lightshow'>;

/**
 * Modifies the wrapper contents of a beatmap file for compatibility with the indicated map format.
 * @param type The beatmap file type.
 * @param targetVersion The new map format to convert the beatmap file into.
 * @param data The wrapper contents of the beatmap file.
 * @param sourceVersion The original map format. Lightshow sources include lighting embedded in v1/v2 difficulties.
 * @returns The converted wrapper contents of the beatmap file.
 */
export function convertBeatmap<
   TFileType extends BeatmapFileType,
   TVersion extends InferBeatmapVersion<TFileType>,
   TWrapper extends InferBeatmapWrapper<TFileType>,
>(
   type: TFileType,
   targetVersion: TVersion,
   data: TWrapper,
   sourceVersion?: InferBeatmapSourceVersion<TFileType>,
): TWrapper {
   const logger = getLogger();

   if (!isSupportedMajorVersion(type, targetVersion as number)) {
      throw new Error(`Unsupported ${type} beatmap version ${String(targetVersion)}.`);
   }
   if (
      sourceVersion !== undefined &&
      !isSupportedMajorVersion(type === 'lightshow' ? 'difficulty' : type, sourceVersion as number)
   ) {
      throw new Error(
         `Unsupported ${type} source beatmap version ${String(sourceVersion)}.`,
      );
   }

   logger?.tInfo(
      tag('convertBeatmap'),
      `Converting wrapper contents for ${type} to version ${targetVersion}`,
   );

   switch (type) {
      case 'info': {
         const convert = resolveConverter(
            infoConvertMap,
            'info',
            targetVersion as InferBeatmapVersion<'info'>,
         );
         return convert(data as InferBeatmapWrapper<'info'>, sourceVersion) as TWrapper;
      }
      case 'audioData': {
         const convert = resolveConverter(
            audioDataConvertMap,
            'audioData',
            targetVersion as InferBeatmapVersion<'audioData'>,
         );
         return convert(data as InferBeatmapWrapper<'audioData'>, sourceVersion) as TWrapper;
      }
      case 'difficulty': {
         const convert = resolveConverter(
            beatmapConvertMap,
            'difficulty',
            targetVersion as InferBeatmapVersion<'difficulty'>,
         );
         return convert(data as InferBeatmapWrapper<'difficulty'>, sourceVersion) as TWrapper;
      }
      case 'lightshow': {
         const convert = resolveConverter(
            beatmapConvertMap,
            'lightshow',
            targetVersion as InferBeatmapVersion<'lightshow'>,
         );
         return convert(data as InferBeatmapWrapper<'lightshow'>, sourceVersion) as TWrapper;
      }
      default: {
         logger?.tWarn(tag(type), `No convert map found. Skipping conversion step.`);
         return data;
      }
   }
}
