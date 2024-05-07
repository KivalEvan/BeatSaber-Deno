import logger from '../../../logger.ts';
import type { IWrapInfo } from '../../../types/beatmap/wrapper/info.ts';

function tag(name: string): string[] {
   return ['convert', 'toV4Info', name];
}

export function toV4Info(data: IWrapInfo, fromVersion: number): IWrapInfo {
   logger.tWarn(tag('main'), 'Converting to beatmap v4 may lose certain data!');

   switch (fromVersion) {
      case 1:
      case 2:
      case 3:
      case 4:
         break;
      default:
         logger.tWarn(
            tag('main'),
            'Unknown version: version not supported; misinput? Returning original data.',
         );
   }

   return data;
}
