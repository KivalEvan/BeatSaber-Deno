import { ISpecialEventsKeywordFilters } from '../../types/beatmap/v2/specialEventsKeywordFilters.ts';
import { DeepPartial } from '../../types/utils.ts';
import { WrapEventTypesWithKeywords } from '../wrapper/eventTypesWithKeywords.ts';
import { ISpecialEventsKeywordFiltersKeywords } from '../../types/beatmap/v2/specialEventsKeywordFiltersKeywords.ts';
import { IWrapEventTypesWithKeywordsAttribute } from '../../types/beatmap/wrapper/eventTypesWithKeywords.ts';

/** Dummy special event types with keywords beatmap v4 class object. */
export class DummySpecialEventsKeywordFilters extends WrapEventTypesWithKeywords<
   ISpecialEventsKeywordFilters,
   ISpecialEventsKeywordFiltersKeywords
> {
   static default: Required<ISpecialEventsKeywordFilters> = {
      _keywords: [],
   };

   constructor();
   constructor(data: DeepPartial<IWrapEventTypesWithKeywordsAttribute>);
   constructor(data: DeepPartial<ISpecialEventsKeywordFilters>);
   constructor(
      data:
         & DeepPartial<ISpecialEventsKeywordFilters>
         & DeepPartial<IWrapEventTypesWithKeywordsAttribute>,
   );
   constructor(
      _:
         & DeepPartial<ISpecialEventsKeywordFilters>
         & DeepPartial<IWrapEventTypesWithKeywordsAttribute> = {},
   ) {
      super();
      this.list = [];
   }

   static create(): DummySpecialEventsKeywordFilters;
   static create(
      data: DeepPartial<IWrapEventTypesWithKeywordsAttribute>,
   ): DummySpecialEventsKeywordFilters;
   static create(data: DeepPartial<ISpecialEventsKeywordFilters>): DummySpecialEventsKeywordFilters;
   static create(
      data:
         & DeepPartial<ISpecialEventsKeywordFilters>
         & DeepPartial<IWrapEventTypesWithKeywordsAttribute>,
   ): DummySpecialEventsKeywordFilters;
   static create(
      data:
         & DeepPartial<ISpecialEventsKeywordFilters>
         & DeepPartial<IWrapEventTypesWithKeywordsAttribute> = {},
   ): DummySpecialEventsKeywordFilters {
      return new this(data);
   }

   toJSON(): Required<ISpecialEventsKeywordFilters> {
      return {
         _keywords: [],
      };
   }

   get list(): never[] {
      return this._list as never[];
   }
   set list(value: never[]) {
      this._list = value;
   }

   addList(value: never) {
      this._list.push(value);
      return this;
   }
}
