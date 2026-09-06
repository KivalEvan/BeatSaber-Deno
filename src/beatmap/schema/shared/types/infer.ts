// deno-lint-ignore-file no-explicit-any
import type { v1, v2, v3, v4 } from '../../mod.ts';
import type { IWrapAudioData } from '../../wrapper/types/audioData.ts';
import type { IWrapBeatmap } from '../../wrapper/types/beatmap.ts';
import type { IWrapInfo, IWrapInfoBeatmap } from '../../wrapper/types/info.ts';
import type { DeepPartial } from '../../../../types/utils.ts';
import type { BeatmapFileType, DeserializationOptions } from './schema.ts';

export type InferBeatmapVersion<
   TFileType extends BeatmapFileType = BeatmapFileType,
> = TFileType extends 'info' ? 1 | 2 | 4
   : TFileType extends 'audioData' ? 2 | 4
   : TFileType extends 'difficulty' ? 1 | 2 | 3 | 4
   : TFileType extends 'lightshow' ? 3 | 4
   : number;

/** Source versions for wrapper conversion, including lighting embedded in v1/v2 difficulties. */
export type InferBeatmapSourceVersion<TFileType extends BeatmapFileType = BeatmapFileType> =
   InferBeatmapVersion<TFileType extends 'lightshow' ? 'difficulty' : TFileType>;

export type InferBeatmapWrapper<
   TFileType extends BeatmapFileType = BeatmapFileType,
> = TFileType extends 'info' ? IWrapInfo
   : TFileType extends 'audioData' ? IWrapAudioData
   : TFileType extends 'difficulty' | 'lightshow' ? IWrapBeatmap
   : Record<string, any>;

type InfoSerialMap = [never, v1.IInfo, v2.IInfo, never, v4.IInfo];
type AudioDataSerialMap = [never, never, v2.IBPMInfo, never, v4.IAudio];
type DifficultySerialMap = [never, v1.IDifficulty, v2.IDifficulty, v3.IDifficulty, v4.IDifficulty];
type LightshowSerialMap = [never, never, never, v3.ILightshow, v4.ILightshow];

export type InferBeatmapSerial<
   TFileType extends BeatmapFileType = BeatmapFileType,
   TVersion extends InferBeatmapVersion<TFileType> = InferBeatmapVersion<TFileType>,
> = TFileType extends 'info' ? InfoSerialMap[TVersion]
   : TFileType extends 'audioData' ? AudioDataSerialMap[TVersion]
   : TFileType extends 'difficulty' ? DifficultySerialMap[TVersion]
   : TFileType extends 'lightshow' ? LightshowSerialMap[TVersion]
   : Record<string, any>;

type DifficultySerializationPolyfills =
   & Pick<IWrapInfo['audio'], 'bpm' | 'shuffle' | 'shufflePeriod'>
   & Pick<IWrapInfoBeatmap, 'njs' | 'njsOffset'>
   & { beatsPerBar: number };

type InfoV1DeserializationPolyfills = Pick<IWrapInfo, 'filename'> & {
   audio: Pick<
      IWrapInfo['audio'],
      | 'filename'
      | 'audioDataFilename'
      | 'lufs'
      | 'duration'
      | 'audioOffset'
      | 'shuffle'
      | 'shufflePeriod'
   >;
};

type InfoV2DeserializationPolyfills = Pick<IWrapInfo, 'filename'> & {
   audio: Pick<IWrapInfo['audio'], 'audioDataFilename' | 'lufs' | 'duration'>;
};

type AudioDataV2DeserializationPolyfills = Pick<
   IWrapAudioData,
   'filename' | 'audioChecksum'
>;

type BeatmapDeserializationPolyfills = Pick<
   IWrapBeatmap,
   'filename' | 'lightshowFilename'
>;

/** Serialization options supported by a beatmap file type and version. */
export type InferBeatmapSerializationOptions<
   TFileType extends BeatmapFileType,
   TVersion extends InferBeatmapVersion<TFileType>,
> = TFileType extends 'difficulty'
   ? TVersion extends 1 ? DeepPartial<DifficultySerializationPolyfills>
   : never
   : never;

/** Deserialization options supported by a beatmap file type and version. */
export type InferBeatmapDeserializationOptions<
   TFileType extends BeatmapFileType,
   TVersion extends InferBeatmapVersion<TFileType>,
> =
   & Partial<DeserializationOptions>
   & (TFileType extends 'info' ? TVersion extends 1 ? DeepPartial<InfoV1DeserializationPolyfills>
      : TVersion extends 2 ? DeepPartial<InfoV2DeserializationPolyfills>
      : TVersion extends 4 ? DeepPartial<Pick<IWrapInfo, 'filename'>>
      : never
      : TFileType extends 'audioData'
         ? TVersion extends 2 ? DeepPartial<AudioDataV2DeserializationPolyfills>
         : TVersion extends 4 ? DeepPartial<Pick<IWrapAudioData, 'filename'>>
         : never
      : TFileType extends 'difficulty' | 'lightshow' ? DeepPartial<BeatmapDeserializationPolyfills>
      : never);
