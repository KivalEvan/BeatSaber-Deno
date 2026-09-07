import type { Fallback } from '../types/utils.ts';
import type { IDataCodec } from './codec.ts';

export type InferWrapper<T extends Pick<IDataCodec, "name">> = T extends IDataCodec<infer W, infer _S, infer _Ctx> ? W : never;
export type InferSerial<T extends Pick<IDataCodec, "name">> = T extends IDataCodec<infer _W, infer S, infer _Ctx> ? S : never;
export type InferContext<T extends Pick<IDataCodec, "name">> = T extends IDataCodec<infer _W, infer _S, infer Ctx> ? Fallback<Ctx, undefined> : undefined;

// deno-lint-ignore no-explicit-any
export type InferOptions<T extends Pick<IDataCodec, "name">, TOptions = { [key: string]: any }> = TOptions & (InferContext<T> extends never | undefined ? { [key: string]: any } : { context: InferContext<T> });
