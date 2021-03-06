import { IColorBoostEvent } from '../../types/beatmap/v3/colorBoostEvent.ts';
import { ObjectReturnFn } from '../../types/utils.ts';
import { BaseObject } from './baseObject.ts';
import { deepCopy } from '../../utils/misc.ts';

/** Boost event beatmap v3 class object. */
export class ColorBoostEvent extends BaseObject<IColorBoostEvent> {
    static default: ObjectReturnFn<Required<IColorBoostEvent>> = {
        b: 0,
        o: false,
        customData: () => {
            return {};
        },
    };

    protected constructor(boostEvent: Required<IColorBoostEvent>) {
        super(boostEvent);
    }

    static create(): ColorBoostEvent[];
    static create(...colorBoostEvents: Partial<IColorBoostEvent>[]): ColorBoostEvent[];
    static create(...colorBoostEvents: Partial<IColorBoostEvent>[]): ColorBoostEvent[] {
        const result: ColorBoostEvent[] = [];
        colorBoostEvents?.forEach((be) =>
            result.push(
                new this({
                    b: be.b ?? ColorBoostEvent.default.b,
                    o: be.o ?? ColorBoostEvent.default.o,
                    customData: be.customData ?? ColorBoostEvent.default.customData(),
                }),
            )
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                b: ColorBoostEvent.default.b,
                o: ColorBoostEvent.default.o,
                customData: ColorBoostEvent.default.customData(),
            }),
        ];
    }

    toJSON(): Required<IColorBoostEvent> {
        return {
            b: this.time,
            o: this.toggle,
            customData: deepCopy(this.customData),
        };
    }

    /** Toggle `<boolean>` of boost event. */
    get toggle() {
        return this.data.o;
    }
    set toggle(value: IColorBoostEvent['o']) {
        this.data.o = value;
    }
}
