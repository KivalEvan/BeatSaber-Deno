import type { MirrorFn } from '../beatmap/schema/shared/types/functions.ts';
import { getLogger } from '../logger.ts';
import type { InferOptions, InferSerial, InferWrapper } from './_types.ts';
import type { IDataCodec } from './codec.ts';
import type { DataValidator, IValidateOptions } from './validator.ts';

/** The available methods that may be passed to a data loader factory. */
interface ILoaderMethods<T extends Pick<IDataCodec, 'name' | 'decode'>> {
   /** A serial validator, which runs before the deserialization step. */
   validator?: DataValidator<T>;
}

/** Customizable options for the data loader. */
export interface ILoadOptions<T extends Pick<IDataCodec, 'name' | 'decode'>> {
   /** Customizable options for the serial validator (when supplied). */
   validate?: IValidateOptions;
   /** Perform side-effects to the serial data before being processed. */
   preprocess?: MirrorFn<InferSerial<T>>[];
   /** Perform side-effects to the wrapper data after being processed. */
   postprocess?: MirrorFn<InferWrapper<T>>[];
}

/**
 * Creates a data loader for processing a serial data type into its wrapper format.
 * @param codec The data processing strategy.
 * @param methods Optional methods that may be integrated within the processing workflow.
 * @returns A data saver function which performs the full processing workflow.
 */
export function createLoader<const T extends Pick<IDataCodec, 'name' | 'decode'>>(
   codec: T,
   methods: ILoaderMethods<T>,
): (data: InferSerial<T>, options: InferOptions<T, ILoadOptions<T>>) => InferWrapper<T> {
   const logger = getLogger();

   return function load(data, options) {
      let serial = data;

      const [...preprocesses] = options?.preprocess ?? [];

      for (const [i, fn] of preprocesses.entries()) {
         logger?.tDebug([load.name, codec.name], 'Running preprocess function #' + (i + 1));
         serial = fn(serial);
      }

      if (methods?.validator) {
         methods.validator(serial, { context: options.context, ...options.validate });
      }

      let wrapper = codec.decode(serial, options.context);

      const [...postprocesses] = options?.postprocess ?? [];

      for (const [i, fn] of postprocesses.entries()) {
         logger?.tDebug([load.name, codec.name], 'Running postprocess function #' + (i + 1));
         wrapper = fn(wrapper);
      }

      return wrapper;
   };
}

/** The available methods that may be passed to a data saver factory. */
interface ISaverMethods<T extends Pick<IDataCodec, 'name' | 'encode'>> {
   /** A serial validator, which runs after the serialization step. */
   validator?: DataValidator<T>;
}

/** Customizable options for the data saver. */
export interface ISaveOptions<T extends Pick<IDataCodec, 'name' | 'encode'>> {
   /** Customizable options for the serial validator (when supplied). */
   validate?: IValidateOptions;
   /** Perform side-effects to the wrapper data before being processed. */
   preprocess?: MirrorFn<InferWrapper<T>>[];
   /** Perform side-effects to the serial data after being processed. */
   postprocess?: MirrorFn<InferSerial<T>>[];
}

/**
 * Creates a data saver for processing a wrapper data type into its serial format.
 * @param codec The data processing strategy.
 * @param methods Optional methods that may be integrated within the processing workflow.
 * @returns A data saver function which performs the full processing workflow.
 */
export function createSaver<const T extends Pick<IDataCodec, 'name' | 'encode'>>(
   codec: T,
   methods: ISaverMethods<T>,
): (data: InferWrapper<T>, options: InferOptions<T, ISaveOptions<T>>) => InferSerial<T> {
   const logger = getLogger();

   return function save(data, options) {
      let wrapper = data;

      const [...preprocesses] = options?.preprocess ?? [];

      for (const [i, fn] of preprocesses.entries()) {
         logger?.tInfo([save.name, codec.name], 'Running preprocess function #' + (i + 1));
         wrapper = fn(wrapper);
      }

      let serial = codec.encode(wrapper, options.context);

      if (methods.validator) {
         methods.validator(serial, { context: options.context, ...options.validate });
      }

      const [...postprocesses] = options?.postprocess ?? [];

      for (const [i, fn] of postprocesses.entries()) {
         logger?.tInfo([save.name, codec.name], 'Running postprocess function #' + (i + 1));
         serial = fn(serial);
      }

      return serial;
   };
}
