import { IBaseNote } from './baseNote.ts';
import { ICustomDataNote } from './customData.ts';

export interface IColorNote extends IBaseNote {
    /** Color type `<int>` of note.
     * ```ts
     * 0 -> Red
     * 1 -> Blue
     * ```
     */
    c: 0 | 1;
    /** Cut direction `<int>` of note.
     * ```ts
     * 4 | 0 | 5
     * 2 | 8 | 3
     * 6 | 1 | 7
     * ```
     * ---
     * Grid represents cut direction from center.
     *
     * **WARNING:** Dot-directional is not recommended with sliders, assumes down-directional.
     */
    d: number;
    /** Angle offset in degree counter-clockwise `<int>` of note.*/
    a: number;
    customData?: ICustomDataNote;
}
