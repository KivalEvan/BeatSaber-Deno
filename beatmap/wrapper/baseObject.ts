import { IWrapBaseObject } from '../../types/beatmap/wrapper/baseObject.ts';
import { WrapBaseItem } from './baseItem.ts';

/** Basic building block of beatmap object. */
export abstract class WrapBaseObject<T extends { [P in keyof T]: T[P] }> extends WrapBaseItem<T>
    implements IWrapBaseObject<T> {
    protected _time!: IWrapBaseObject['time'];

    abstract get time(): IWrapBaseObject['time'];
    abstract set time(value: IWrapBaseObject['time']);

    setTime(value: number) {
        this.time = value;
        return this;
    }
}
