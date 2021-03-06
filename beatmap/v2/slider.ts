import { ISlider } from '../../types/beatmap/v2/slider.ts';
import { ObjectReturnFn } from '../../types/utils.ts';
import { LINE_COUNT } from '../shared/constants.ts';
import { Serializable } from '../shared/serializable.ts';

/** Slider beatmap v2 class object. */
export class Slider extends Serializable<ISlider> {
    static default: ObjectReturnFn<Required<ISlider>> = {
        _colorType: 0,
        _headTime: 0,
        _headLineIndex: 0,
        _headLineLayer: 0,
        _headCutDirection: 0,
        _headControlPointlengthMultiplier: 1,
        _tailTime: 0,
        _tailLineIndex: 0,
        _tailLineLayer: 0,
        _tailCutDirection: 0,
        _tailControlPointLengthMultiplier: 1,
        _sliderMidAnchorMode: 0,
    };

    protected constructor(slider: Required<ISlider>) {
        super(slider);
    }

    static create(): Slider[];
    static create(...sliders: Partial<ISlider>[]): Slider[];
    static create(...sliders: Partial<ISlider>[]): Slider[] {
        const result: Slider[] = [];
        sliders?.forEach((s) =>
            result.push(
                new this({
                    _colorType: s._colorType ?? Slider.default._colorType,
                    _headTime: s._headTime ?? s._tailTime ?? Slider.default._headTime,
                    _headLineIndex: s._headLineIndex ?? Slider.default._headLineIndex,
                    _headLineLayer: s._headLineLayer ?? Slider.default._headLineLayer,
                    _headCutDirection: s._headCutDirection ?? Slider.default._headCutDirection,
                    _headControlPointlengthMultiplier: s._headControlPointlengthMultiplier ??
                        Slider.default._headControlPointlengthMultiplier,
                    _tailTime: s._tailTime ?? s._headTime ?? Slider.default._tailTime,
                    _tailLineIndex: s._tailLineIndex ?? Slider.default._tailLineIndex,
                    _tailLineLayer: s._tailLineLayer ?? Slider.default._tailLineLayer,
                    _tailCutDirection: s._tailCutDirection ?? Slider.default._tailCutDirection,
                    _tailControlPointLengthMultiplier: s._tailControlPointLengthMultiplier ??
                        Slider.default._tailControlPointLengthMultiplier,
                    _sliderMidAnchorMode: s._sliderMidAnchorMode ?? Slider.default._sliderMidAnchorMode,
                }),
            )
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                _colorType: Slider.default._colorType,
                _headTime: Slider.default._headTime,
                _headLineIndex: Slider.default._headLineIndex,
                _headLineLayer: Slider.default._headLineLayer,
                _headCutDirection: Slider.default._headCutDirection,
                _headControlPointlengthMultiplier: Slider.default._headControlPointlengthMultiplier,
                _tailTime: Slider.default._tailTime,
                _tailLineIndex: Slider.default._tailLineIndex,
                _tailLineLayer: Slider.default._tailLineLayer,
                _tailCutDirection: Slider.default._tailCutDirection,
                _tailControlPointLengthMultiplier: Slider.default._tailControlPointLengthMultiplier,
                _sliderMidAnchorMode: Slider.default._sliderMidAnchorMode,
            }),
        ];
    }

    toJSON(): Required<ISlider> {
        return {
            _colorType: this.colorType,
            _headTime: this.headTime,
            _headLineIndex: this.headPosX,
            _headLineLayer: this.headPosY,
            _headCutDirection: this.headCutDirection,
            _headControlPointlengthMultiplier: this.headLengthMultiplier,
            _tailTime: this.tailTime,
            _tailLineIndex: this.tailPosX,
            _tailLineLayer: this.tailPosY,
            _tailCutDirection: this.tailCutDirection,
            _tailControlPointLengthMultiplier: this.tailLengthMultiplier,
            _sliderMidAnchorMode: this.midAnchor,
        };
    }
    /** Color type `<int>` of base slider.
     * ```ts
     * 0 -> Red
     * 1 -> Blue
     * ```
     */
    get colorType() {
        return this.data._colorType;
    }
    set colorType(value: ISlider['_colorType']) {
        this.data._colorType = value;
    }

    /** Tail beat time `<float>` of base slider. */
    get headTime() {
        return this.data._headTime;
    }
    set headTime(value: number) {
        this.data._headTime = value;
    }

    /** Head position x `<int>` of base slider.
     * ```ts
     * 0 -> Outer Left
     * 1 -> Middle Left
     * 2 -> Middle Right
     * 3 -> Outer Right
     * ```
     * ---
     * Range: `0-3`
     */
    get headPosX() {
        return this.data._headLineIndex;
    }
    set headPosX(value: ISlider['_headLineIndex']) {
        this.data._headLineIndex = value;
    }

    /** Head position y `<int>` of base slider.
     * ```ts
     * 0 -> Bottom row
     * 1 -> Middle row
     * 2 -> Top row
     * ```
     * ---
     * Range: `0-2`
     */
    get headPosY() {
        return this.data._headLineLayer;
    }
    set headPosY(value: ISlider['_headLineLayer']) {
        this.data._headLineLayer = value;
    }

    /** Head cut direction `<int>` of base slider.
     * ```ts
     * 4 | 0 | 5
     * 2 | 8 | 3
     * 6 | 1 | 7
     * ```
     * ---
     * Grid represents cut direction from center.
     *
     * **WARNING:** Dot-directional is not recommended, assumes down-directional.
     */
    get headCutDirection() {
        return this.data._headCutDirection;
    }
    set headCutDirection(value: ISlider['_headCutDirection']) {
        this.data._headCutDirection = value;
    }

    /** Head control point length multiplier `<float>` of slider.
     * ```ts
     * 0 -> Flat Start
     * 1 -> Curved Start
     * ```
     * ---
     * Range: `0-1`
     */
    get headLengthMultiplier() {
        return this.data._headControlPointlengthMultiplier;
    }
    set headLengthMultiplier(value: ISlider['_headControlPointlengthMultiplier']) {
        this.data._headControlPointlengthMultiplier = value;
    }

    /** Tail beat time `<float>` of base slider. */
    get tailTime() {
        return this.data._tailTime;
    }
    set tailTime(value: number) {
        this.data._tailTime = value;
    }

    /** Tail position x `<int>` of base slider.
     * ```ts
     * 0 -> Outer Left
     * 1 -> Middle Left
     * 2 -> Middle Right
     * 3 -> Outer Right
     * ```
     * ---
     * Range: `none`
     */
    get tailPosX() {
        return this.data._tailLineIndex;
    }
    set tailPosX(value: ISlider['_tailLineIndex']) {
        this.data._tailLineIndex = value;
    }

    /** Tail position y `<int>` of base slider.
     * ```ts
     * 0 -> Bottom row
     * 1 -> Middle row
     * 2 -> Top row
     * ```
     * ---
     * Range: `0-2`
     */
    get tailPosY() {
        return this.data._tailLineLayer;
    }
    set tailPosY(value: ISlider['_tailLineLayer']) {
        this.data._tailLineLayer = value;
    }

    /** Tail cut direction `<int>` of slider.
     * ```ts
     * 4 | 0 | 5
     * 2 | 8 | 3
     * 6 | 1 | 7
     * ```
     * ---
     * Grid represents cut direction from center.
     *
     * **WARNING:** Dot-directional is not recommended, assumes down-directional.
     */
    get tailCutDirection() {
        return this.data._tailCutDirection;
    }
    set tailCutDirection(value: ISlider['_tailCutDirection']) {
        this.data._tailCutDirection = value;
    }

    /** Tail control point length multiplier `<float>` of slider.
     * ```ts
     * 0 -> Flat End
     * 1 -> Curved End
     * ```
     * ---
     * Range: `0-1`
     */
    get tailLengthMultiplier() {
        return this.data._tailControlPointLengthMultiplier;
    }
    set tailLengthMultiplier(value: ISlider['_tailControlPointLengthMultiplier']) {
        this.data._tailControlPointLengthMultiplier = value;
    }

    /** Mid anchor mode `<int>` of slider.
     * ```ts
     * 0 -> Straight
     * 1 -> Clockwise
     * 2 -> Counter-Clockwise
     * ```
     */
    get midAnchor() {
        return this.data._sliderMidAnchorMode;
    }
    set midAnchor(value: ISlider['_sliderMidAnchorMode']) {
        this.data._sliderMidAnchorMode = value;
    }

    setColor(value: ISlider['_colorType']) {
        this.colorType = value;
        return this;
    }
    setPosX(value: ISlider['_headLineIndex']) {
        this.headPosX = value;
        return this;
    }
    setPosY(value: ISlider['_headLineLayer']) {
        this.headPosY = value;
        return this;
    }
    setDirection(value: ISlider['_headCutDirection']) {
        this.headCutDirection = value;
        return this;
    }
    setLengthMultiplier(value: ISlider['_headControlPointlengthMultiplier']) {
        this.headLengthMultiplier = value;
        return this;
    }
    setTailTime(value: number) {
        this.tailTime = value;
        return this;
    }
    setTailPosX(value: ISlider['_tailLineIndex']) {
        this.tailPosX = value;
        return this;
    }
    setTailPosY(value: ISlider['_tailLineLayer']) {
        this.tailPosY = value;
        return this;
    }
    setTailDirection(value: ISlider['_tailCutDirection']) {
        this.tailCutDirection = value;
        return this;
    }
    setTailLengthMultiplier(value: ISlider['_tailControlPointLengthMultiplier']) {
        this.tailLengthMultiplier = value;
        return this;
    }
    setMidAnchor(value: ISlider['_sliderMidAnchorMode']) {
        this.midAnchor = value;
        return this;
    }

    mirror(flipColor = true) {
        this.headPosX = LINE_COUNT - 1 - this.headPosX;
        this.tailPosX = LINE_COUNT - 1 - this.tailPosX;
        if (flipColor) {
            this.colorType = ((1 + this.colorType) % 2) as typeof this.colorType;
        }
        switch (this.headCutDirection) {
            case 2:
                this.headCutDirection = 3;
                break;
            case 3:
                this.headCutDirection = 2;
                break;
            case 6:
                this.headCutDirection = 7;
                break;
            case 7:
                this.headCutDirection = 6;
                break;
            case 4:
                this.headCutDirection = 5;
                break;
            case 5:
                this.headCutDirection = 4;
                break;
        }
        switch (this.tailCutDirection) {
            case 2:
                this.tailCutDirection = 3;
                break;
            case 3:
                this.tailCutDirection = 2;
                break;
            case 6:
                this.tailCutDirection = 7;
                break;
            case 7:
                this.tailCutDirection = 6;
                break;
            case 4:
                this.tailCutDirection = 5;
                break;
            case 5:
                this.tailCutDirection = 4;
                break;
        }
        if (this.midAnchor) {
            this.midAnchor = this.midAnchor === 1 ? 2 : 1;
        }
        return this;
    }

    /** Check if slider has Mapping Extensions properties.
     * ```ts
     * if (slider.hasMappingExtensions()) {}
     * ```
     */
    hasMappingExtensions() {
        return (
            this.headPosY > 2 ||
            this.headPosY < 0 ||
            this.headPosX <= -1000 ||
            this.headPosX >= 1000 ||
            (this.headCutDirection >= 1000 && this.headCutDirection <= 1360) ||
            (this.tailCutDirection >= 1000 && this.tailCutDirection <= 1360)
        );
    }
}
