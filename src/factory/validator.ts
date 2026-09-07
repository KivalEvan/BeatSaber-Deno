import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { IDataCodec } from './codec.ts';
import type { InferContext, InferOptions, InferSerial } from './_types.ts';
import { getLogger } from '../logger.ts';

/** Customizable options for the serial validator. */
export interface IValidateOptions {
   /** Whether the validator should immediately throw for invalid data. @default true */
   abortEarly?: boolean;
   /** The max number of issues to collect for diagnostics. @default 100 */
   maxIssues?: number;
}

function formatIssues(scope: string, issues: readonly StandardSchemaV1.Issue[]) {
   return issues.map((issue, index) => {
      const segments = issue.path?.map((x) =>
         typeof x === 'object' && x !== null && 'key' in x ? x.key : x
      ) ?? [];

      const path = segments.reduce<string>((acc, s) => {
         const segment = s.toString();

         if (typeof s === 'number' || /^[0-9]|[^a-zA-Z0-9_$]/.test(segment)) {
            return `${acc}[${segment}]`;
         }

         return acc ? `${acc}.${segment}` : segment;
      }, scope);

      return `> [${index}] ${issue.message} at ${path}`;
   });
}

/** Validates unknown serial data against a Standard Schema compatible schema. */
export type DataValidator<T extends Pick<IDataCodec, 'name'>> = (
   data: unknown,
   options: InferOptions<T, IValidateOptions>,
) => StandardSchemaV1.Result<InferSerial<T>>;

/**
 * Creates a serial validator for data processing workflows.
 * @param codec The data processing strategy.
 * @param validator A method that resolves the schema used for validating the serial data type.
 * @returns The serial validator, which may be used within data processing factories.
 */
export function createValidator<const T extends Pick<IDataCodec, 'name'>>(
   codec: T,
   validator: (context: InferContext<T>) => StandardSchemaV1<InferSerial<T>>,
): DataValidator<T> {
   const logger = getLogger();

   return function validate(data, options) {
      const { context, abortEarly = true, maxIssues = 100 } = options;

      logger?.tInfo([validate.name, codec.name], `Validating data...`);

      const schema = validator(context);
      const result = schema['~standard'].validate(data) as StandardSchemaV1.Result<InferSerial<T>>;

      if ('issues' in result && result.issues) {
         const count = result.issues.length;
         const buffer = count > maxIssues ? result.issues.slice(0, maxIssues) : result.issues;
         const message = `Validation failed with ${count} issue(s).`;

         logger?.tError([validate.name, codec.name], message);

         let summary = formatIssues(codec.name, buffer);

         if (count > maxIssues) {
            summary = summary.concat(`> […] ${count - maxIssues} more issue(s)`);
         }

         for (const message of summary) {
            logger?.tError([validate.name, codec.name], message);
         }

         if (abortEarly) {
            throw new Error(message, { cause: buffer });
         }
      }

      return result;
   };
}
