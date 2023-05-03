import { ModType } from '../../types/beatmap/shared/modCheck.ts';
import { INote } from '../../types/beatmap/v2/note.ts';
import { IWrapColorNoteAttribute } from '../../types/beatmap/wrapper/colorNote.ts';
import { ObjectReturnFn } from '../../types/utils.ts';
import { Vector2 } from '../../types/vector.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapColorNote } from '../wrapper/colorNote.ts';

/** Note beatmap v2 class object. */
export class Note extends WrapColorNote<Required<INote>> {
    static default: ObjectReturnFn<Required<INote>> = {
        _time: 0,
        _lineIndex: 0,
        _lineLayer: 0,
        _type: 0,
        _cutDirection: 0,
        _customData: () => {
            return {};
        },
    };

    constructor();
    constructor(data: Partial<IWrapColorNoteAttribute<Required<INote>>>);
    constructor(data: Partial<INote>);
    constructor(data: Partial<INote> & Partial<IWrapColorNoteAttribute<Required<INote>>>);
    constructor(data: Partial<INote> & Partial<IWrapColorNoteAttribute<Required<INote>>> = {}) {
        super({
            _time: data.time ?? data._time ?? Note.default._time,
            _lineIndex: data.posX ?? data._lineIndex ?? Note.default._lineIndex,
            _lineLayer: data.posY ?? data._lineLayer ?? Note.default._lineLayer,
            _type: data.type ?? data._type ?? Note.default._type,
            _cutDirection: data.direction ?? data._cutDirection ?? Note.default._cutDirection,
            _customData: data.customData ?? data._customData ?? Note.default._customData(),
        });
    }

    static create(): Note[];
    static create(...data: Partial<IWrapColorNoteAttribute<Required<INote>>>[]): Note[];
    static create(...data: Partial<INote>[]): Note[];
    static create(
        ...data: (Partial<INote> & Partial<IWrapColorNoteAttribute<Required<INote>>>)[]
    ): Note[];
    static create(
        ...data: (Partial<INote> & Partial<IWrapColorNoteAttribute<Required<INote>>>)[]
    ): Note[] {
        const result: Note[] = [];
        data?.forEach((obj) => result.push(new this(obj)));
        if (result.length) {
            return result;
        }
        return [new this()];
    }

    toJSON(): Required<INote> {
        return {
            _time: this.time,
            _type: this.type,
            _lineIndex: this.posX,
            _lineLayer: this.posY,
            _cutDirection: this.direction,
            _customData: deepCopy(this.customData),
        };
    }

    get time() {
        return this.data._time;
    }
    set time(value: INote['_time']) {
        this.data._time = value;
    }

    get posX() {
        return this.data._lineIndex;
    }
    set posX(value: INote['_lineIndex']) {
        this.data._lineIndex = value;
    }

    get posY() {
        return this.data._lineLayer;
    }
    set posY(value: INote['_lineLayer']) {
        this.data._lineLayer = value;
    }

    get type() {
        return this.data._type;
    }
    set type(value: INote['_type']) {
        this.data._type = value;
    }

    get color() {
        return this.data._type as 0;
    }
    set color(value: 0 | 1) {
        this.data._type = value;
    }

    get direction() {
        return this.data._cutDirection;
    }
    set direction(value: INote['_cutDirection']) {
        this.data._cutDirection = value;
    }

    get angleOffset() {
        return 0;
    }
    set angleOffset(_: number) {
        // TODO: do some calculation with direction?
    }

    get customData(): NonNullable<INote['_customData']> {
        return this.data._customData;
    }
    set customData(value: NonNullable<INote['_customData']>) {
        this.data._customData = value;
    }

    getPosition(type?: ModType): Vector2 {
        switch (type) {
            case 'vanilla':
                return super.getPosition();
            case 'ne':
                if (this.customData._position) {
                    return [this.customData._position[0], this.customData._position[1]];
                }
            /** falls through */
            case 'me':
            default:
                return [
                    (this.posX <= -1000
                        ? this.posX / 1000
                        : this.posX >= 1000
                        ? this.posX / 1000
                        : this.posX) - 2,
                    this.posY <= -1000
                        ? this.posY / 1000
                        : this.posY >= 1000
                        ? this.posY / 1000
                        : this.posY,
                ];
        }
    }

    getAngle(type?: ModType): number {
        switch (type) {
            case 'vanilla':
                return super.getAngle(type);
            case 'ne':
                if (this.customData._cutDirection) {
                    return this.customData._cutDirection > 0
                        ? this.customData._cutDirection % 360
                        : 360 + (this.customData._cutDirection % 360);
                }
            /* falls through */
            case 'me':
            default:
                if (this.direction >= 1000) {
                    return Math.abs(((this.direction % 1000) % 360) - 360);
                }
                return super.getAngle();
        }
    }

    isChroma(): boolean {
        return (
            Array.isArray(this.customData._color) ||
            typeof this.customData._disableSpawnEffect === 'boolean'
        );
    }

    // god i hate these
    isNoodleExtensions(): boolean {
        return (
            Array.isArray(this.customData._animation) ||
            typeof this.customData._cutDirection === 'number' ||
            typeof this.customData._disableNoteGravity === 'boolean' ||
            typeof this.customData._disableNoteLook === 'boolean' ||
            typeof this.customData._fake === 'boolean' ||
            Array.isArray(this.customData._flip) ||
            typeof this.customData._interactable === 'boolean' ||
            Array.isArray(this.customData._localRotation) ||
            typeof this.customData._noteJumpMovementSpeed === 'number' ||
            typeof this.customData._noteJumpStartBeatOffset === 'number' ||
            Array.isArray(this.customData._position) ||
            Array.isArray(this.customData._rotation)
        );
    }
}
