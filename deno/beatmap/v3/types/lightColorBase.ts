import { Serializable } from '../../shared/types/serializable.ts';

/** Basic building block of beatmap light. */
export interface ILightColorBase {
    /** Add beat time `<float>` to event box group. */
    b: number;
    /** Transition type `<int>` of base light color.
     * ```ts
     * 0 -> Instant
     * 1 -> Interpolate
     * 2 -> Extend
     * ```
     */
    i: 0 | 1 | 2;
    /** Color `<int>` of base light color.
     * ```ts
     * 0 -> Red
     * 1 -> Blue
     * ```
     */
    c: 0 | 1;
    /** Brightness `<float>` of base light color.
     *
     * Range: `0-1` (0% to 100%), can be more than 1.
     */
    s: number;
    /** Frequency `<int>` of base light color.
     *
     * Blinking frequency in beat time of the event, `0` is static.
     */
    f: number;
}

export class LightColorBase extends Serializable<ILightColorBase> {
    private b;
    private i;
    private c;
    private s;
    private f;
    constructor(lightColorBase: Required<ILightColorBase>) {
        super();
        this.b = lightColorBase.b;
        this.i = lightColorBase.i;
        this.c = lightColorBase.c;
        this.s = lightColorBase.s;
        this.f = lightColorBase.f;
    }

    static create(): LightColorBase;
    static create(lightColors: Partial<ILightColorBase>): LightColorBase;
    static create(...lightColors: Partial<ILightColorBase>[]): LightColorBase[];
    static create(
        ...lightColors: Partial<ILightColorBase>[]
    ): LightColorBase | LightColorBase[] {
        const result: LightColorBase[] = [];
        lightColors?.forEach((lc) =>
            result.push(
                new LightColorBase({
                    b: lc.b ?? 0,
                    i: lc.i ?? 0,
                    c: lc.c ?? 0,
                    s: lc.s ?? 1,
                    f: lc.f ?? 0,
                })
            )
        );
        if (result.length === 1) {
            return result[0];
        }
        if (result.length) {
            return result;
        }
        return new LightColorBase({
            b: 0,
            i: 0,
            c: 0,
            s: 1,
            f: 0,
        });
    }

    public toObject(): ILightColorBase {
        return {
            b: this.time,
            i: this.transition,
            c: this.color,
            s: this.brightness,
            f: this.frequency,
        };
    }

    get time() {
        return this.b;
    }
    set time(value: ILightColorBase['b']) {
        this.b = value;
    }

    get transition() {
        return this.i;
    }
    set transition(value: ILightColorBase['i']) {
        this.i = value;
    }

    get color() {
        return this.c;
    }
    set color(value: ILightColorBase['c']) {
        this.c = value;
    }

    get brightness() {
        return this.s;
    }
    set brightness(value: ILightColorBase['s']) {
        this.s = value;
    }

    get frequency() {
        return this.f;
    }
    set frequency(value: ILightColorBase['f']) {
        this.f = value;
    }
}