import { BaseObject } from './baseObject.ts';
import { IBaseNote } from '../../types/beatmap/v3/baseNote.ts';

/** Base note beatmap v3 class object. */
export abstract class BaseNote<T extends IBaseNote> extends BaseObject<T> {
    /** Position x `<int>` of note.
     * ```ts
     * 0 -> Outer Left
     * 1 -> Middle Left
     * 2 -> Middle Right
     * 3 -> Outer Right
     * ```
     * ---
     * Range: `0-3`
     */
    get posX() {
        return this.data.x;
    }
    set posX(value: IBaseNote['x']) {
        this.data.x = value;
    }

    /** Position y `<int>` of note.
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
    set posY(value: IBaseNote['y']) {
        this.data.y = value;
    }

    setPosX(value: IBaseNote['x']) {
        this.posX = value;
        return this;
    }
    setPosY(value: IBaseNote['y']) {
        this.posY = value;
        return this;
    }

    /** Swap note position with another note.
     * ```ts
     * note.swapPosition(noteSwap);
     * ```
     */
    swapPosition(toSwap: BaseNote<T>) {
        const tempX = toSwap.posX;
        toSwap.posX = this.posX;
        this.posX = tempX;
        const tempY = toSwap.posY;
        toSwap.posY = this.posY;
        this.posY = tempY;
        return this;
    }

    /** Get note position and return the Beatwalls' position x and y value in tuple.
     * ```ts
     * const notePos = note.getPosition();
     * ```
     */
    getPosition(type?: 'vanilla' | 'me' | 'ne'): [number, number] {
        switch (type) {
            case 'vanilla':
                return [this.posX - 2, this.posY];
            case 'me':
                return [
                    (this.posX <= -1000 ? this.posX / 1000 : this.posX >= 1000 ? this.posX / 1000 : this.posX) - 2,
                    this.posY <= -1000 ? this.posY / 1000 : this.posY >= 1000 ? this.posY / 1000 : this.posY,
                ];
            case 'ne':
                if (this.customData.coordinates) {
                    return [
                        this.customData.coordinates[0],
                        this.customData.coordinates[1],
                    ];
                }
                return [this.posX - 2, this.posY];
            default:
                if (this.customData.coordinates) {
                    return [
                        this.customData.coordinates[0],
                        this.customData.coordinates[1],
                    ];
                }
                return [
                    (this.posX <= -1000 ? this.posX / 1000 : this.posX >= 1000 ? this.posX / 1000 : this.posX) - 2,
                    this.posY <= -1000 ? this.posY / 1000 : this.posY >= 1000 ? this.posY / 1000 : this.posY,
                ];
        }
    }

    /** Get two notes and return the distance between two notes.
     * ```ts
     * if (note.getDistance(noteCompare)) {}
     * ```
     */
    abstract getDistance(compareTo: BaseNote<T>): number;

    /** Compare two notes and return if the notes is in vertical alignment.
     * ```ts
     * if (note.isVertical(noteCompare)) {}
     * ```
     */
    abstract isVertical(compareTo: BaseNote<T>): boolean;

    /** Compare two notes and return if the notes is in horizontal alignment.
     * ```ts
     * if (note.isHorizontal(noteCompare)) {}
     * ```
     */
    abstract isHorizontal(compareTo: BaseNote<T>): boolean;

    /** Compare two notes and return if the notes is in diagonal alignment.
     * ```ts
     * if (note.isDiagonal(noteCompare)) {}
     * ```
     */
    abstract isDiagonal(compareTo: BaseNote<T>): boolean;

    /** Compare two  notes and return if the  notes is an inline.
     * ```ts
     * if (note.isInline(noteCompare)) {}
     * ```
     */
    abstract isInline(compareTo: BaseNote<T>, lapping: number): boolean;

    /** Compare two notes and return if the notes is adjacent.
     * ```ts
     * if (note.isAdjacent(noteCompare)) {}
     * ```
     */
    abstract isAdjacent(compareTo: BaseNote<T>): boolean;

    /** Compare two notes and return if the notes is a window.
     * ```ts
     * if (note.isWindow(noteCompare)) {}
     * ```
     */
    abstract isWindow(compareTo: BaseNote<T>, distance: number): boolean;

    /** Compare two notes and return if the notes is a slanted window.
     * ```ts
     * if (note.isSlantedWindow(noteCompare)) {}
     * ```
     */
    abstract isSlantedWindow(compareTo: BaseNote<T>): boolean;

    abstract hasChroma(): boolean;
    abstract hasNoodleExtensions(): boolean;
    abstract hasMappingExtensions(): boolean;
    abstract mirror(): this;
    abstract isValid(): boolean;
}
