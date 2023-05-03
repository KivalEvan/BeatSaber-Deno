import { ModType } from '../../types/beatmap/shared/modCheck.ts';
import { IObstacle } from '../../types/beatmap/v3/obstacle.ts';
import { IWrapObstacleAttribute } from '../../types/beatmap/wrapper/obstacle.ts';
import { ObjectReturnFn } from '../../types/utils.ts';
import { Vector2 } from '../../types/vector.ts';
import { deepCopy } from '../../utils/misc.ts';
import { isVector3 } from '../../utils/vector.ts';
import { WrapObstacle } from '../wrapper/obstacle.ts';

/** Obstacle beatmap v3 class object. */
export class Obstacle extends WrapObstacle<Required<IObstacle>> {
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

    constructor();
    constructor(data: Partial<IWrapObstacleAttribute<Required<IObstacle>>>);
    constructor(data: Partial<IObstacle>);
    constructor(data: Partial<IObstacle> & Partial<IWrapObstacleAttribute<Required<IObstacle>>>);
    constructor(
        data: Partial<IObstacle> & Partial<IWrapObstacleAttribute<Required<IObstacle>>> = {},
    ) {
        super({
            b: data.time ?? data.b ?? Obstacle.default.b,
            x: data.posX ?? data.x ?? Obstacle.default.x,
            y: data.posY ?? data.y ?? Obstacle.default.y,
            d: data.duration ?? data.d ?? Obstacle.default.d,
            w: data.width ?? data.w ?? Obstacle.default.w,
            h: data.height ?? data.h ?? Obstacle.default.h,
            customData: data.customData ?? Obstacle.default.customData(),
        });
    }

    static create(): Obstacle[];
    static create(...data: Partial<IWrapObstacleAttribute<Required<IObstacle>>>[]): Obstacle[];
    static create(...data: Partial<IObstacle>[]): Obstacle[];
    static create(
        ...data: (Partial<IObstacle> & Partial<IWrapObstacleAttribute<Required<IObstacle>>>)[]
    ): Obstacle[];
    static create(
        ...data: (Partial<IObstacle> & Partial<IWrapObstacleAttribute<Required<IObstacle>>>)[]
    ): Obstacle[] {
        const result: Obstacle[] = [];
        data?.forEach((obj) => result.push(new this(obj)));
        if (result.length) {
            return result;
        }
        return [new this()];
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

    get time() {
        return this.data.b;
    }
    set time(value: IObstacle['b']) {
        this.data.b = value;
    }

    get posX() {
        return this.data.x;
    }
    set posX(value: IObstacle['x']) {
        this.data.x = value;
    }

    get posY() {
        return this.data.y;
    }
    set posY(value: IObstacle['y']) {
        this.data.y = value;
    }

    get duration() {
        return this.data.d;
    }
    set duration(value: IObstacle['d']) {
        this.data.d = value;
    }

    get width() {
        return this.data.w;
    }
    set width(value: IObstacle['w']) {
        this.data.w = value;
    }

    get height() {
        return this.data.h;
    }
    set height(value: IObstacle['h']) {
        this.data.h = value;
    }

    get customData(): NonNullable<IObstacle['customData']> {
        return this.data.customData;
    }
    set customData(value: NonNullable<IObstacle['customData']>) {
        this.data.customData = value;
    }

    mirror() {
        const width = this.customData.size?.[0] ?? this.width;
        if (this.customData.coordinates) {
            this.customData.coordinates[0] = -1 - this.customData.coordinates[0];
        }
        if (this.customData.animation) {
            if (Array.isArray(this.customData.animation.definitePosition)) {
                if (isVector3(this.customData.animation.definitePosition)) {
                    this.customData.animation.definitePosition[0] =
                        -this.customData.animation.definitePosition[0] - (this.posX + width - 1);
                } else {
                    // deno-lint-ignore no-explicit-any
                    this.customData.animation.definitePosition.forEach((dp: any) => {
                        dp[0] = -dp[0] - (this.posX + width - 1);
                    });
                }
            }
            if (Array.isArray(this.customData.animation.offsetPosition)) {
                if (isVector3(this.customData.animation.offsetPosition)) {
                    this.customData.animation.offsetPosition[0] =
                        -this.customData.animation.offsetPosition[0] - (this.posX + width - 1);
                } else {
                    // deno-lint-ignore no-explicit-any
                    this.customData.animation.offsetPosition.forEach((op: any) => {
                        op[0] = -op[0] - (this.posX + width - 1);
                    });
                }
            }
        }
        return super.mirror();
    }

    getPosition(type?: ModType): Vector2 {
        switch (type) {
            case 'vanilla':
                return super.getPosition();
            case 'ne':
                if (this.customData.coordinates) {
                    return [this.customData.coordinates[0], this.customData.coordinates[1]];
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
                    (this.posY <= -1000
                        ? this.posY / 1000
                        : this.posY >= 1000
                        ? this.posY / 1000
                        : this.posY) - 0.5,
                ];
        }
    }

    isChroma(): boolean {
        return Array.isArray(this.customData.color);
    }

    isNoodleExtensions(): boolean {
        return (
            Array.isArray(this.customData.animation) ||
            typeof this.customData.uninteractable === 'boolean' ||
            Array.isArray(this.customData.localRotation) ||
            typeof this.customData.noteJumpMovementSpeed === 'number' ||
            typeof this.customData.noteJumpStartBeatOffset === 'number' ||
            Array.isArray(this.customData.coordinates) ||
            Array.isArray(this.customData.worldRotation) ||
            Array.isArray(this.customData.size)
        );
    }

    isMappingExtensions(): boolean {
        return this.posY > 2 || this.posX <= -1000 || this.posX >= 1000;
    }
}
