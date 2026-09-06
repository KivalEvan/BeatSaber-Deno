// deno-lint-ignore-file no-explicit-any
import { getLogger } from '../../logger.ts';
import type { ILoadOptions } from './types.ts';
import type { MirrorFn } from '../schema/shared/types/functions.ts';
import type {
   InferBeatmapSerial,
   InferBeatmapSourceVersion,
   InferBeatmapVersion,
   InferBeatmapWrapper,
} from '../schema/shared/types/infer.ts';
import type { BeatmapFileType } from '../schema/shared/types/schema.ts';
import {
   implicitVersion,
   isSupportedMajorVersion,
   parseMajorVersion,
   retrieveVersion,
} from '../helpers/version.ts';
import { convertBeatmap } from '../mapping/converter.ts';
import { deserializeBeatmap } from '../mapping/deserialize.ts';
import { validateJSON } from '../mapping/validator.ts';
import { isRecord, jsonTypeName } from '../../utils/misc/json.ts';
import { hasOwn } from '../../utils/misc/hasOwn.ts';

export function tag(name: string): string[] {
   return ['loader', name];
}

/** Throws unless the value is a non-null, non-array object usable as beatmap JSON. */
function assertJSONObject(type: BeatmapFileType, stage: string, data: unknown): void {
   if (!isRecord(data) || Array.isArray(data)) {
      throw new TypeError(
         `${stage} for ${type} beatmap JSON: expected object but received ${jsonTypeName(data)}`,
      );
   }
}

const defaultOptions = {
   forceConvert: true,
   customDataOwnership: 'copy',
   schemaCheck: {},
   sort: true,
   preprocess: [],
   postprocess: [],
} as const;

export function loadBeatmap<
   TFileType extends BeatmapFileType,
   TVersion extends InferBeatmapVersion<TFileType>,
   TWrapper extends Record<string, any> = InferBeatmapWrapper<TFileType>,
   TSerial extends Record<string, any> = InferBeatmapSerial<TFileType, TVersion>,
>(
   type: TFileType,
   json: TSerial,
   version?: TVersion | null,
   options: ILoadOptions<TFileType, TVersion, TWrapper, TSerial> = {},
): TWrapper {
   const logger = getLogger();

   if (!isRecord(json) || Array.isArray(json)) {
      throw new TypeError(
         `Invalid ${type} JSON data: expected object but received ${jsonTypeName(json)}`,
      );
   }

   // Reject unsupported explicit target versions before conversion.
   const ver: TVersion | null = typeof version === 'number' ? version : null;
   if (ver !== null && !isSupportedMajorVersion(type, ver)) {
      throw new Error(
         `Unsupported ${type} beatmap version ${ver}, prevented from loading.`,
      );
   }

   const optD = (typeof version !== 'number' ? version : options) ?? options ?? {};
   const opt: Required<ILoadOptions<TFileType, TVersion, TWrapper, TSerial>> = {
      forceConvert: optD.forceConvert ?? defaultOptions.forceConvert,
      customDataOwnership: optD.customDataOwnership ?? defaultOptions.customDataOwnership,
      schemaCheck: { ...defaultOptions.schemaCheck, ...optD.schemaCheck },
      sort: optD.sort ?? defaultOptions.sort,
      preprocess: optD.preprocess ?? defaultOptions.preprocess as any,
      postprocess: optD.postprocess ?? defaultOptions.postprocess as any,
   };

   const [pretransformer, ...preprocesses] = opt.preprocess;
   let serial = pretransformer
      ? pretransformer(json, version)
      : json as InferBeatmapSerial<TFileType, TVersion>;
   assertJSONObject(type, 'Invalid output from pretransform function', serial);
   preprocesses.forEach((fn, i) => {
      logger?.tInfo(tag('loadBeatmap'), 'Running preprocess function #' + (i + 1));
      serial = fn(serial);
      assertJSONObject(type, `Invalid output from preprocess function #${i + 1}`, serial);
   });

   const jsonVersion = retrieveVersion(serial);
   let jsonVer: TVersion;
   if (jsonVersion === undefined) {
      if (hasOwn(serial, '_version') || hasOwn(serial, 'version')) {
         throw new TypeError(
            `Malformed ${type} beatmap version undefined: expected a version string`,
         );
      }
      jsonVer = +implicitVersion(type).at(0)! as TVersion;
      logger?.tWarn(
         tag('loadBeatmap'),
         'Could not identify beatmap version from JSON, assume implicit version',
         jsonVer,
      );
   } else if (jsonVersion === null) {
      throw new TypeError(
         `Malformed ${type} beatmap version null: expected a version string`,
      );
   } else if (typeof jsonVersion !== 'string') {
      throw new TypeError(
         `Malformed ${type} beatmap version ${
            JSON.stringify(jsonVersion)
         }: expected a version string`,
      );
   } else {
      const major = parseMajorVersion(jsonVersion);
      if (major === undefined) {
         throw new Error(
            `Could not parse ${type} beatmap version "${jsonVersion}".`,
         );
      }
      if (!isSupportedMajorVersion(type, major)) {
         throw new Error(
            `Unsupported ${type} beatmap version "${jsonVersion}".`,
         );
      }
      jsonVer = major as TVersion;
   }

   let attribute: InferBeatmapWrapper<TFileType>;
   if (opt.schemaCheck.enabled) validateJSON(type, serial, jsonVer, opt.schemaCheck);
   attribute = deserializeBeatmap(type, jsonVer, serial, {
      customDataOwnership: opt.customDataOwnership,
   });

   if (ver !== null && jsonVer !== ver) {
      if (!opt.forceConvert) {
         throw new Error(
            `Beatmap version unmatched, expected ${ver} but received ${jsonVer}`,
         );
      }
      logger?.tWarn(
         tag('loadBeatmap'),
         'Beatmap version unmatched, expected',
         ver,
         'but received',
         jsonVer,
         'for version; Converting to beatmap version',
         ver,
      );
      attribute = convertBeatmap(
         type,
         ver,
         attribute,
         attribute.version as InferBeatmapSourceVersion<TFileType>,
      );
   }

   if (opt.sort && 'sort' in attribute && typeof attribute.sort === 'function') {
      attribute.sort();
   }

   const [posttransformer, ...postprocesses] = [...opt.postprocess].reverse() as [
      (data: InferBeatmapWrapper<TFileType>, version: TVersion | null) => TWrapper,
      ...MirrorFn<InferBeatmapWrapper<TFileType>>[],
   ];
   postprocesses.forEach((fn, i) => {
      logger?.tInfo(tag('loadBeatmap'), 'Running postprocess function #' + (i + 1));
      attribute = fn(attribute);
      assertJSONObject(type, `Invalid output from postprocess function #${i + 1}`, attribute);
   });

   const wrapper = posttransformer ? posttransformer(attribute, ver) : attribute as TWrapper;
   assertJSONObject(type, 'Invalid output from posttransform function', wrapper);
   return wrapper;
}
