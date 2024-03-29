// deno-lint-ignore-file no-explicit-any no-empty-interface
import { IDataCheckOption } from '../beatmap/shared/dataCheck.ts';
import { IWrapAudio } from '../beatmap/wrapper/audioData.ts';
import { IWrapDifficulty } from '../beatmap/wrapper/difficulty.ts';
import { IWrapInfo } from '../beatmap/wrapper/info.ts';
import { IWrapLightshow } from '../beatmap/wrapper/lightshow.ts';
import { IBaseOptions } from './options.ts';

export interface ILoadOptionsBase<T = Record<string, any>> extends IBaseOptions {
   /**
    * Force version conversion if loaded difficulty version is mismatched.
    *
    * @default true
    */
   forceConvert?: boolean;
   /** Data check option when loading. */
   dataCheck?: IDataCheckOption;
   /** Sort object(s) on load. */
   sort?: boolean;
   /**
    * Perform any preprocessing when JSON is created or passed.
    *
    * **Warning**: This may result in side-effects if object is passed.
    *
    * @default []
    */
   preprocess?: ((data: Record<string, any>) => Record<string, any>)[];
   /**
    * Perform any postprocessing after object class has been instantiated.
    *
    * @default []
    */
   postprocess?: ((data: T) => T)[];
}

export interface ILoadOptionsDifficulty extends ILoadOptionsBase<IWrapDifficulty> {}

export interface ILoadOptionsLightshow extends ILoadOptionsBase<IWrapLightshow> {}

export interface ILoadOptionsInfo extends ILoadOptionsBase<IWrapInfo> {
   /**
    * Set info source file path.
    *
    * @default 'Info.dat'
    */
   filePath?: string;
}

export interface ILoadOptionsAudioData extends ILoadOptionsBase<IWrapAudio> {
}
