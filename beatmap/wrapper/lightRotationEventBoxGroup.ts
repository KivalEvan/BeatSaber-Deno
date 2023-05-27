import { WrapEventBoxGroup } from './eventBoxGroup.ts';
import { IWrapLightRotationEventBoxGroup } from '../../types/beatmap/wrapper/lightRotationEventBoxGroup.ts';
import { IWrapLightRotationEventBox } from '../../types/beatmap/wrapper/lightRotationEventBox.ts';

/** Light rotation event box group beatmap class object. */
export abstract class WrapLightRotationEventBoxGroup<
    TGroup extends { [P in keyof TGroup]: TGroup[P] },
    TBox extends { [P in keyof TBox]: TBox[P] },
    TBase extends { [P in keyof TBase]: TBase[P] },
    TFilter extends { [P in keyof TFilter]: TFilter[P] },
> extends WrapEventBoxGroup<TGroup, TBox, TBase, TFilter>
    implements IWrapLightRotationEventBoxGroup<TGroup, TBox, TBase, TFilter> {
    declare protected _boxes: IWrapLightRotationEventBox<TBox, TBase, TFilter>[];

    abstract get boxes(): IWrapLightRotationEventBox<TBox, TBase, TFilter>[];
    abstract set boxes(value: IWrapLightRotationEventBox<TBox, TBase, TFilter>[]);
}
