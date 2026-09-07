// deno-lint-ignore-file ban-types
/**
 * All primitive types in JavaScript.
 */
export type Primitive =
   | string
   | Function
   | number
   | boolean
   | Symbol
   | undefined
   | null;

/**
 * Make all properties in T non-readonly.
 */
export type Writable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Make all nested properties in T non-readonly.
 */
export type DeepWritable<T> = {
   -readonly [P in keyof T]: T[P] extends object ? DeepWritable<T[P]> : T[P];
};

/**
 * Make all nested properties in T optional.
 */
export type DeepPartial<T> = T extends Function ? T
   : T extends Array<infer Member> ? Array<DeepPartial<Member>>
   : T extends (infer X extends string | number) & {} ? X
   : T extends object ? { [Key in NonNullable<keyof T>]?: DeepPartial<T[Key]> }
   : T;

/**
 * Make all properties in T optional except those in Ignore.
 */
export type DeepPartialIgnore<T, Ignore extends string> = {
   [P in keyof T]?: T[P] extends object ? P extends Ignore ? T[P]
      : DeepPartial<T[P]>
      : T[P];
};

/**
 * Allow arbitrary string or number on type value.
 */
export type LooseAutocomplete<T extends string | number> = T extends string ? T | (string & {})
   : T | (number & {});

/**
 * Make all properties in T nullable.
 */
export type Nullable<T> = T extends Primitive ? T | null
   : {
      [P in keyof T]?: Nullable<T[P]>;
   };

/**
 * Extract the union of item/value types from an iterable object.
 */
export type Member<T> = T extends Readonly<Array<unknown>> ? T[number]
   : T extends Readonly<Record<PropertyKey, unknown>> ? T[keyof T]
   : never;

type Inspect<T> = T extends infer R ? R : never;

/** Allow a fallback type to be used when the supplied type is `never`. */
export type Fallback<T, TFallback> = Inspect<T> extends never ? TFallback : T;
