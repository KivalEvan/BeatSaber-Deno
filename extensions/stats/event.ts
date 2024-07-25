import { EventList } from '../../beatmap/shared/environment.ts';
import type { EnvironmentAllName } from '../../types/beatmap/shared/environment.ts';
import type { IWrapColorBoostEvent } from '../../types/beatmap/wrapper/colorBoostEvent.ts';
import type { IWrapBasicEvent } from '../../types/beatmap/wrapper/basicEvent.ts';
import type { ICountEvent } from './types/stats.ts';
import { hasChromaEventV2, hasChromaEventV3 } from '../../beatmap/helpers/modded/has.ts';

/**
 * Count number of type of events with their properties in given array and return a event count object.
 * ```ts
 * const list = count(events);
 * console.log(list);
 * ```
 */
export function countEvent(
   events: IWrapBasicEvent[],
   boost: IWrapColorBoostEvent[],
   environment: EnvironmentAllName = 'DefaultEnvironment',
   version = 2,
): ICountEvent {
   const commonEvent = EventList[environment]?.[0] ?? EventList['DefaultEnvironment'][0];
   const eventCount: ICountEvent = {};
   for (let i = commonEvent.length - 1; i >= 0; i--) {
      eventCount[commonEvent[i]] = {
         total: 0,
         chroma: 0,
         chromaOld: 0,
      };
   }
   const hasChroma = version >= 3 ? hasChromaEventV3 : hasChromaEventV2;

   eventCount[5] = {
      total: boost.length,
      chroma: 0,
      chromaOld: 0,
   };

   for (let i = events.length - 1; i >= 0; i--) {
      if (events[i].isValidType()) {
         if (!eventCount[events[i].type]) {
            eventCount[events[i].type] = {
               total: 0,
               chroma: 0,
               chromaOld: 0,
            };
         }
         eventCount[events[i].type].total++;
         if (hasChroma(events[i])) {
            eventCount[events[i].type].chroma++;
         }
         if (events[i].isOldChroma()) {
            eventCount[events[i].type].chromaOld++;
         }
      }
   }
   return eventCount;
}
