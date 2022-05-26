import { IEventBoxGroupTemplate } from '../../types/beatmap/v3/eventBoxGroupTemplate.ts';
import { deepCopy } from '../../utils/misc.ts';
import { Serializable } from '../shared/serializable.ts';
import { EventBoxGroup } from './eventBoxGroup.ts';

export abstract class EventBoxGroupTemplate<
    T,
    U extends Serializable<T>,
> extends EventBoxGroup {
    private e: U[];

    protected constructor(
        eventBoxGroup: Required<IEventBoxGroupTemplate<T>>,
        objects: U[],
    ) {
        super(eventBoxGroup);
        this.e = objects;
    }

    toObject(): IEventBoxGroupTemplate<T> {
        return {
            b: this.time,
            g: this.groupID,
            e: this.events.map((e) => e.toObject()),
            customData: deepCopy(this.customData),
        };
    }

    get events() {
        return this.e;
    }
    set events(value: U[]) {
        this.e = value;
    }
}
