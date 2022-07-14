import { ISpecialEventsKeywordFiltersKeywords } from '../../types/beatmap/v2/specialEventsKeywordFiltersKeywords.ts';
import { ISpecialEventsKeywordFilters } from '../../types/beatmap/v2/specialEventsKeywordFilters.ts';
import { ObjectToReturn } from '../../types/utils.ts';
import { Serializable } from '../shared/serializable.ts';
import { SpecialEventsKeywordFiltersKeywords } from './specialEventsKeywordFiltersKeywords.ts';

/** Special event types with keywords beatmap v2 class object. */
export class SpecialEventsKeywordFilters extends Serializable<ISpecialEventsKeywordFilters> {
    static default: ObjectToReturn<Required<ISpecialEventsKeywordFilters>> = {
        _keywords: () => [],
    };

    keywords: SpecialEventsKeywordFiltersKeywords[];
    protected constructor(specialEventsWithKeywords: Required<ISpecialEventsKeywordFilters>) {
        super(specialEventsWithKeywords);
        this.keywords = specialEventsWithKeywords._keywords.map((d) =>
            SpecialEventsKeywordFiltersKeywords.create({
                _keyword: d._keyword,
                _specialEvents: d._specialEvents,
            })
        );
    }

    static create(specialEventsWithKeywords: Partial<ISpecialEventsKeywordFilters> = {}): SpecialEventsKeywordFilters {
        return new this({
            _keywords: specialEventsWithKeywords._keywords ?? SpecialEventsKeywordFilters.default._keywords(),
        });
    }

    toObject(): ISpecialEventsKeywordFilters {
        return {
            _keywords: this.keywords.map((d) => d.toObject()),
        };
    }

    /** Data list of basic event types with keywords. */
    setKeyword(value: SpecialEventsKeywordFiltersKeywords[]) {
        this.keywords = value;
        return this;
    }
    addKeyword(value: ISpecialEventsKeywordFiltersKeywords) {
        this.keywords.push(SpecialEventsKeywordFiltersKeywords.create(value));
        return this;
    }
    removeKeyword(value: string) {
        this.keywords = this.keywords.filter((d) => d.keyword !== value);
        return this;
    }
}
