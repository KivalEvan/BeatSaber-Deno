import { IRotationEvent } from '../../types/beatmap/v3/rotationEvent.ts';
import { ObjectReturnFn } from '../../types/utils.ts';
import { BaseObject } from './baseObject.ts';
import { deepCopy } from '../../utils/misc.ts';

/** Rotation event beatmap v3 class object. */
export class RotationEvent extends BaseObject<IRotationEvent> {
    static default: ObjectReturnFn<Required<IRotationEvent>> = {
        b: 0,
        e: 0,
        r: 0,
        customData: () => {
            return {};
        },
    };

    protected constructor(rotationEvent: Required<IRotationEvent>) {
        super(rotationEvent);
    }

    static create(): RotationEvent[];
    static create(...rotationEvents: Partial<IRotationEvent>[]): RotationEvent[];
    static create(...rotationEvents: Partial<IRotationEvent>[]): RotationEvent[] {
        const result: RotationEvent[] = [];
        rotationEvents?.forEach((re) =>
            result.push(
                new this({
                    b: re.b ?? RotationEvent.default.b,
                    e: re.e ?? RotationEvent.default.e,
                    r: re.r ?? RotationEvent.default.r,
                    customData: re.customData ?? RotationEvent.default.customData(),
                }),
            )
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                b: RotationEvent.default.b,
                e: RotationEvent.default.e,
                r: RotationEvent.default.r,
                customData: RotationEvent.default.customData(),
            }),
        ];
    }

    toJSON(): Required<IRotationEvent> {
        return {
            b: this.time,
            e: this.executionTime,
            r: this.rotation,
            customData: deepCopy(this.customData),
        };
    }

    /** Execution time `<int>` of rotation event.
     * ```ts
     * 0 -> Early
     * 1 -> Late
     * ```
     */
    get executionTime() {
        return this.data.e;
    }
    set executionTime(value: IRotationEvent['e']) {
        this.data.e = value;
    }

    /** Clockwise rotation value `<float>` of rotation event. */
    get rotation() {
        return this.data.r;
    }
    set rotation(value: IRotationEvent['r']) {
        this.data.r = value;
    }

    setExecutionTime(value: IRotationEvent['e']) {
        this.executionTime = value;
        return this;
    }
    setRotation(value: IRotationEvent['r']) {
        this.rotation = value;
        return this;
    }
}
