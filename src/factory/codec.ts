// deno-lint-ignore-file no-explicit-any
import type { Fallback } from '../types/utils.ts';

/** The base configuration for a processing strategy. */
export interface ICodec {
	/** The identifier for the strategy. */
	name: string;
}

/** A strategy for processing a serializable data type. */
export interface IDataCodec<TWrapper = any, TSerial = any, TContext = never> extends ICodec {
  /**
	 * Converts a wrapper data type into its serial format. 
	 * @param data The wrapper form of the data type.
	 * @param context The shared context for all processing methods.
	 * @returns The serial format of the data type.
	 */
	encode: (data: TWrapper, context: Fallback<TContext, undefined>) => TSerial;
	/**
	 * Converts a serial data type into its wrapper format.
	 * @param data The serial format of the data type.
	 * @param context The shared context for all processing methods.
	 * @returns The wrapper format of the data type.
	 */
	decode: (data: TSerial, context: Fallback<TContext, undefined>) => TWrapper;
}

/**
 * Creates a processing strategy for a serializable data type.
 * @param name The identifier for the strategy.
 * @param container The associated methods for data processing.
 * @returns A function that returns a data processing strategy.
 */
export function createDataCodec<const TWrapper, const TSerial, const TContext = never>(
	name: string,
	container: Omit<IDataCodec<TWrapper, TSerial, TContext>, keyof ICodec>,
): () => IDataCodec<TWrapper, TSerial, TContext> {
	return function codec() {
		return { ...container, name: name };
	};
}

/** A strategy for processing a serializable data type according to its versioned contract(s). */
export interface IEntityCodec<TWrapper = any, TSerials extends { [key: PropertyKey]: unknown } = any, TContext = never> extends ICodec {
	/** A record of versioned keys to their associated strategies. */
	codecs: {
		[TVersion in keyof TSerials]: Omit<IDataCodec<TWrapper, TSerials[TVersion], TContext>, keyof ICodec>;
	};
	/**
	 * Derives the versioned key from the resolved serializable data type.
	 * @param data The serial data type resolved during the deserialization step.
	 * @returns The versioned key(s) associated with each resolved data type.
	 */
	getVersion: <const TVersion extends keyof TSerials>(data: TSerials[TVersion]) => keyof TSerials;
}

/**
 * Creates a processing strategy for a serializable entity type with a versioning scheme.
 * @param name The identifier for the strategy.
 * @param container The associated versioning scheme for entity processing.
 * @returns A function that returns a data processing strategy.
 */
export function createEntityCodec<const TWrapper, const TSerials extends { [key: PropertyKey]: unknown }, const TContext = never>(
	name: string,
	container: Omit<IEntityCodec<TWrapper, TSerials, TContext>, keyof ICodec>,
): <const TVersion extends keyof TSerials>(version?: TVersion) => IDataCodec<TWrapper, TSerials[TVersion], TContext> {
	return function codec(version) {
		return {
			name: name,
			encode: (data, context) => {
				if (!version) {
					throw new Error("Missing required version for encoder");
				}

				return container.codecs[version].encode(data, context);
			},
			decode: (data, context) => {
				const v = version ?? container.getVersion(data);

				return container.codecs[v].decode(data, context);
			},
		};
	};
}
