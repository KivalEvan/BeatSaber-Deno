import { IBasicEventTypesForKeywords } from '../../types/beatmap/v3/basicEventTypesForKeywords.ts';
import { IBasicEventTypesWithKeywords } from '../../types/beatmap/v3/basicEventTypesWithKeywords.ts';
import { ObjectReturnFn } from '../../types/utils.ts';
import { Serializable } from '../shared/serializable.ts';
import { BasicEventTypesForKeywords } from './basicEventTypesForKeywords.ts';

/** Basic event types with keywords beatmap v3 class object. */
export class BasicEventTypesWithKeywords extends Serializable<IBasicEventTypesWithKeywords> {
    static default: ObjectReturnFn<Required<IBasicEventTypesWithKeywords>> = {
        d: () => [],
    };

    private d: BasicEventTypesForKeywords[];
    protected constructor(basicEventTypesWithKeywords: Required<IBasicEventTypesWithKeywords>) {
        super(basicEventTypesWithKeywords);
        this.d = basicEventTypesWithKeywords.d.map((d) => BasicEventTypesForKeywords.create({ e: d.e, k: d.k })[0]);
    }

    static create(
        basicEventTypesWithKeywords: Partial<IBasicEventTypesWithKeywords> = {},
    ): BasicEventTypesWithKeywords {
        return new this({
            d: basicEventTypesWithKeywords.d ?? BasicEventTypesWithKeywords.default.d(),
        });
    }

    toJSON(): IBasicEventTypesWithKeywords {
        return {
            d: this.list.map((d) => d.toJSON()),
        };
    }

    /** Data list of basic event types with keywords. */
    get list() {
        return this.d;
    }
    set list(value: BasicEventTypesWithKeywords['d']) {
        this.d = value;
    }

    setData(value: BasicEventTypesWithKeywords['d']) {
        this.list = value;
        return this;
    }
    addData(value: IBasicEventTypesForKeywords) {
        this.list.push(BasicEventTypesForKeywords.create(value)[0]);
        return this;
    }
    removeData(value: string) {
        this.list = this.list.filter((d) => d.keyword !== value);
        return this;
    }
}
