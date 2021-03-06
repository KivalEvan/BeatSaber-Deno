import { IObstacle } from '../../types/beatmap/v3/obstacle.ts';
import { BaseObject } from './baseObject.ts';
import { LINE_COUNT } from '../shared/constants.ts';
import { ObjectReturnFn } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';

/** Obstacle beatmap v3 class object. */
export class Obstacle extends BaseObject<IObstacle> {
    static default: ObjectReturnFn<Required<IObstacle>> = {
        b: 0,
        x: 0,
        y: 0,
        d: 1,
        w: 1,
        h: 1,
        customData: () => {
            return {};
        },
    };

    protected constructor(obstacle: Required<IObstacle>) {
        super(obstacle);
    }

    static create(): Obstacle[];
    static create(...obstacles: Partial<IObstacle>[]): Obstacle[];
    static create(...obstacles: Partial<IObstacle>[]): Obstacle[] {
        const result: Obstacle[] = [];
        obstacles?.forEach((o) =>
            result.push(
                new this({
                    b: o.b ?? Obstacle.default.b,
                    x: o.x ?? Obstacle.default.x,
                    y: o.y ?? Obstacle.default.y,
                    d: o.d ?? Obstacle.default.d,
                    w: o.w ?? Obstacle.default.w,
                    h: o.h ?? Obstacle.default.h,
                    customData: o.customData ?? Obstacle.default.customData(),
                }),
            )
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                b: Obstacle.default.b,
                x: Obstacle.default.x,
                y: Obstacle.default.y,
                d: Obstacle.default.d,
                w: Obstacle.default.w,
                h: Obstacle.default.h,
                customData: Obstacle.default.customData(),
            }),
        ];
    }

    toJSON(): Required<IObstacle> {
        return {
            b: this.time,
            x: this.posX,
            y: this.posY,
            d: this.duration,
            w: this.width,
            h: this.height,
            customData: deepCopy(this.customData),
        };
    }

    /** Position x `<int>` of obstacle.
     * ```ts
     * 0 -> Outer Left
     * 1 -> Middle Left
     * 2 -> Middle Right
     * 3 -> Outer Right
     * ```
     * ---
     * Range: `none`
     */
    get posX() {
        return this.data.x;
    }
    set posX(value: IObstacle['x']) {
        this.data.x = value;
    }

    /** Position y `<int>` of obstacle.
     * ```ts
     * 0 -> Bottom row
     * 1 -> Middle row
     * 2 -> Top row
     * ```
     * ---
     * Range: `0-2`
     */
    get posY() {
        return this.data.y;
    }
    set posY(value: IObstacle['y']) {
        this.data.y = value;
    }

    /** Duration `<float>` of obstacle.*/
    get duration() {
        return this.data.d;
    }
    set duration(value: IObstacle['d']) {
        this.data.d = value;
    }

    /** Width `<int>` of obstacle.
     * ---
     * Range: `none`
     */
    get width() {
        return this.data.w;
    }
    set width(value: IObstacle['w']) {
        this.data.w = value;
    }

    /** Height `<int>` of obstacle.
     * ```ts
     * 1 -> Short
     * 2 -> Moderate
     * 3 -> Crouch
     * 4 -> Tall
     * 5 -> Full
     * ```
     * ---
     * Range: `1-5`
     */
    get height() {
        return this.data.h;
    }
    set height(value: IObstacle['h']) {
        this.data.h = value;
    }

    setPosX(value: IObstacle['x']) {
        this.posX = value;
        return this;
    }
    setPosY(value: IObstacle['y']) {
        this.posY = value;
        return this;
    }
    setDuration(value: IObstacle['d']) {
        this.duration = value;
        return this;
    }
    setWidth(value: IObstacle['w']) {
        this.width = value;
        return this;
    }
    setHeight(value: IObstacle['h']) {
        this.height = value;
        return this;
    }

    mirror() {
        const width = this.customData.size?.[0] ?? this.width;
        if (this.customData.coordinates) {
            this.customData.coordinates[0] = -1 - this.customData.coordinates[0];
        }
        if (this.customData.animation) {
            if (Array.isArray(this.customData.animation.definitePosition)) {
                this.customData.animation.definitePosition.forEach((dp) => {
                    dp[0] = -dp[0] - (this.posX + width - 1);
                });
            }
            if (Array.isArray(this.customData.animation.offsetPosition)) {
                this.customData.animation.offsetPosition.forEach((op) => {
                    op[0] = -op[0] - (this.posX + width - 1);
                });
                // fuck mirroring this tbh
            }
        }
        this.posX = LINE_COUNT - 1 - (this.posX + this.width - 1);
        return this;
    }

    /** Get obstacle and return the Beatwalls' position x and y value in tuple.
     * ```ts
     * const obstaclePos = wall.getPosition();
     * ```
     */
    getPosition(): [number, number] {
        if (this.customData.coordinates) {
            return [this.customData.coordinates[0], this.customData.coordinates[1]];
        }
        return [
            (this.posX <= -1000 ? this.posX / 1000 : this.posX >= 1000 ? this.posX / 1000 : this.posX) - 2,
            (this.posY <= -1000 ? this.posY / 1000 : this.posY >= 1000 ? this.posY / 1000 : this.posY) - 0.5,
        ];
    }

    /** Check if obstacle is interactive.
     * ```ts
     * if (wall.isInteractive()) {}
     * ```
     */
    // FIXME: there are a lot more other variables
    isInteractive() {
        return (this.posX < 0 && this.width > 1 - this.posX) || this.width > 1 || this.posX === 1 || this.posX === 2;
    }

    /** Check if obstacle has zero value.
     * ```ts
     * if (wall.hasZero()) {}
     * ```
     */
    hasZero() {
        return this.duration === 0 || this.width === 0 || this.height === 0;
    }

    /** Check if obstacle has negative crouch.
     * ```ts
     * if (wall.hasNegative()) {}
     * ```
     */
    hasNegative() {
        return this.posY < 0 || this.duration < 0 || this.width < 0 || this.height < 0;
    }

    /** Check if current obstacle is longer than previous obstacle.
     * ```ts
     * if (wall.isLonger(compareWall)) {}
     * ```
     */
    isLonger(compareTo: Obstacle, prevOffset = 0): boolean {
        return this.time + this.duration > compareTo.time + compareTo.duration + prevOffset;
    }

    /** Check if obstacle has Chroma properties.
     * ```ts
     * if (wall.hasChroma()) {}
     * ```
     */
    hasChroma = (): boolean => {
        return Array.isArray(this.customData.color);
    };

    /** Check if obstacle has Noodle Extensions properties.
     * ```ts
     * if (wall.hasNoodleExtensions()) {}
     * ```
     */
    hasNoodleExtensions = (): boolean => {
        return (
            Array.isArray(this.customData.animation) ||
            typeof this.customData.uninteractable === 'boolean' ||
            Array.isArray(this.customData.localRotation) ||
            typeof this.customData.noteJumpMovementSpeed === 'number' ||
            typeof this.customData.noteJumpStartBeatOffset === 'number' ||
            Array.isArray(this.customData.coordinates) ||
            Array.isArray(this.customData.worldRotation) ||
            Array.isArray(this.customData.size) ||
            typeof this.customData.track === 'string'
        );
    };

    /** Check if obstacle has Mapping Extensions properties.
     * ```ts
     * if (wall.hasMappingExtensions()) {}
     * ```
     */
    hasMappingExtensions(): boolean {
        return this.posY > 2 || this.posX <= -1000 || this.posX >= 1000;
    }

    /** Check if obstacle is a valid, vanilla obstacle.
     * ```ts
     * if (wall.isValid()) {}
     * ```
     */
    isValid(): boolean {
        return !this.hasMappingExtensions() && !this.hasZero() && !this.hasNegative();
    }
}
