import { ModType } from '../../types/beatmap/shared/modCheck.ts';
import { IObstacle } from '../../types/beatmap/v3/obstacle.ts';
import { IWrapObstacleAttribute } from '../../types/beatmap/wrapper/obstacle.ts';
import { ObjectReturnFn } from '../../types/utils.ts';
import { Vector2 } from '../../types/vector.ts';
import { deepCopy } from '../../utils/misc.ts';
import { isVector3 } from '../../utils/vector.ts';
import { WrapObstacle } from '../wrapper/obstacle.ts';

/** Obstacle beatmap v3 class object. */
export class Obstacle extends WrapObstacle<IObstacle> {
    static default: ObjectReturnFn<IObstacle> = {
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
    constructor(data: Partial<IWrapObstacleAttribute<IObstacle>>);
    constructor(data: Partial<IObstacle>);
    constructor(data: Partial<IObstacle> & Partial<IWrapObstacleAttribute<IObstacle>>);
    constructor(data: Partial<IObstacle> & Partial<IWrapObstacleAttribute<IObstacle>> = {}) {
        super();

        this._time = data.time ?? data.b ?? Obstacle.default.b;
        this._posX = data.posX ?? data.x ?? Obstacle.default.x;
        this._posY = data.posY ?? data.y ?? Obstacle.default.y;
        this._duration = data.duration ?? data.d ?? Obstacle.default.d;
        this._width = data.width ?? data.w ?? Obstacle.default.w;
        this._height = data.height ?? data.h ?? Obstacle.default.h;
        this._customData = data.customData ?? Obstacle.default.customData();
    }

    static create(): Obstacle[];
    static create(...data: Partial<IWrapObstacleAttribute<IObstacle>>[]): Obstacle[];
    static create(...data: Partial<IObstacle>[]): Obstacle[];
    static create(
        ...data: (Partial<IObstacle> & Partial<IWrapObstacleAttribute<IObstacle>>)[]
    ): Obstacle[];
    static create(
        ...data: (Partial<IObstacle> & Partial<IWrapObstacleAttribute<IObstacle>>)[]
    ): Obstacle[] {
        const result: Obstacle[] = [];
        data.forEach((obj) => result.push(new this(obj)));
        if (result.length) {
            return result;
        }
        return [new this()];
    }

    toJSON(): IObstacle {
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

    get customData(): NonNullable<IObstacle['customData']> {
        return this._customData;
    }
    set customData(value: NonNullable<IObstacle['customData']>) {
        this._customData = value;
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
                    this.customData.animation.definitePosition.forEach((dp) => {
                        dp[0] = -dp[0] - (this.posX + width - 1);
                    });
                }
            }
            if (Array.isArray(this.customData.animation.offsetPosition)) {
                if (isVector3(this.customData.animation.offsetPosition)) {
                    this.customData.animation.offsetPosition[0] =
                        -this.customData.animation.offsetPosition[0] - (this.posX + width - 1);
                } else {
                    this.customData.animation.offsetPosition.forEach((op) => {
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
