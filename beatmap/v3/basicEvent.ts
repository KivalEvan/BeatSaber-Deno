// deno-lint-ignore-file no-unused-vars
import { IBasicEvent } from '../../types/beatmap/v3/basicEvent.ts';
import {
    IChromaEventLaser,
    IChromaEventLight,
    IChromaEventRing,
} from '../../types/beatmap/v3/custom/chroma.ts';
import { ObjectReturnFn } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { EnvironmentAllName } from '../../types/beatmap/shared/environment.ts';
import { IWrapEventAttribute } from '../../types/beatmap/wrapper/event.ts';
import { WrapEvent } from '../wrapper/event.ts';

/** Basic event beatmap v3 class object. */
export class BasicEvent extends WrapEvent<IBasicEvent> {
    static default: ObjectReturnFn<IBasicEvent> = {
        b: 0,
        et: 0,
        i: 0,
        f: 1,
        customData: () => {
            return {};
        },
    };

    constructor();
    constructor(data: Partial<IWrapEventAttribute<IBasicEvent>>);
    constructor(...data: Partial<IBasicEvent>[]);
    constructor(data: Partial<IBasicEvent> & Partial<IWrapEventAttribute<IBasicEvent>>);
    constructor(data: Partial<IBasicEvent> & Partial<IWrapEventAttribute<IBasicEvent>> = {}) {
        super();

        this._time = data.time ?? data.b ?? BasicEvent.default.b;
        this._type = data.type ?? data.et ?? BasicEvent.default.et;
        this._value = data.value ?? data.i ?? BasicEvent.default.i;
        this._floatValue = data.floatValue ?? data.f ?? BasicEvent.default.f;
        this._customData = data.customData ?? BasicEvent.default.customData();
    }

    static create(): BasicEvent[];
    static create(...data: Partial<IWrapEventAttribute<IBasicEvent>>[]): BasicEvent[];
    static create(...data: Partial<IBasicEvent>[]): BasicEvent[];
    static create(
        ...data: (Partial<IBasicEvent> & Partial<IWrapEventAttribute<IBasicEvent>>)[]
    ): BasicEvent[];
    static create(
        ...data: (Partial<IBasicEvent> & Partial<IWrapEventAttribute<IBasicEvent>>)[]
    ): BasicEvent[] {
        const result: BasicEvent[] = [];
        data.forEach((obj) => result.push(new this(obj)));
        if (result.length) {
            return result;
        }
        return [
            new this({
                b: BasicEvent.default.b,
                et: BasicEvent.default.et,
                i: BasicEvent.default.i,
                f: BasicEvent.default.f,
                customData: BasicEvent.default.customData(),
            }),
        ];
    }

    toJSON(): IBasicEvent {
        return {
            b: this.time,
            et: this.type,
            i: this.value,
            f: this.floatValue,
            customData: deepCopy(this.customData),
        };
    }

    get time() {
        return this._time;
    }
    set time(value: IBasicEvent['b']) {
        this._time = value;
    }

    get type() {
        return this._type;
    }
    set type(value: IBasicEvent['et']) {
        this._type = value;
    }

    get value() {
        return this._value;
    }
    set value(value: IBasicEvent['i']) {
        this._value = value;
    }

    get floatValue() {
        return this._floatValue;
    }
    set floatValue(value: IBasicEvent['f']) {
        this._floatValue = value;
    }

    get customData(): NonNullable<IBasicEvent['customData']> {
        return this._customData;
    }
    set customData(value: NonNullable<IBasicEvent['customData']>) {
        this._customData = value;
    }

    isLightEvent(environment?: EnvironmentAllName): this is BasicEventLight {
        return super.isLightEvent(environment);
    }

    isRingEvent(environment?: EnvironmentAllName): this is BasicEventRing {
        return super.isRingEvent(environment);
    }

    isLaserRotationEvent(environment?: EnvironmentAllName): this is BasicEventLaser {
        return super.isLaserRotationEvent(environment);
    }

    isLaneRotationEvent(environment?: EnvironmentAllName): this is BasicEventLaneRotation {
        return super.isLaneRotationEvent(environment);
    }

    isChroma(): boolean {
        const ev = this as BasicEvent;
        if (ev.isLightEvent()) {
            return (
                Array.isArray(this.customData.color) ||
                typeof this.customData.lightID === 'number' ||
                Array.isArray(this.customData.lightID) ||
                typeof this.customData.easing === 'string' ||
                typeof this.customData.lerpType === 'string'
            );
        }
        if (ev.isRingEvent()) {
            return (
                typeof this.customData.nameFilter === 'string' ||
                typeof this.customData.rotation === 'number' ||
                typeof this.customData.step === 'number' ||
                typeof this.customData.prop === 'number' ||
                typeof this.customData.speed === 'number' ||
                typeof this.customData.direction === 'number'
            );
        }
        if (ev.isLaserRotationEvent()) {
            return (
                typeof this.customData.lockRotation === 'boolean' ||
                typeof this.customData.speed === 'number' ||
                typeof this.customData.direction === 'number'
            );
        }
        return false;
    }
}

abstract class BasicEventLight extends BasicEvent {
    get customData(): IChromaEventLight {
        return this.customData as IChromaEventLight;
    }
}

abstract class BasicEventRing extends BasicEvent {
    get customData(): IChromaEventRing {
        return this.customData as IChromaEventRing;
    }
}

abstract class BasicEventLaser extends BasicEvent {
    get customData(): IChromaEventLaser {
        return this.customData as IChromaEventLaser;
    }
}

abstract class BasicEventLaneRotation extends BasicEvent {}
