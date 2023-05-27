import { WrapEventBoxGroup } from './eventBoxGroup.ts';
import { IWrapLightTranslationEventBoxGroup } from '../../types/beatmap/wrapper/lightTranslationEventBoxGroup.ts';
import { IWrapLightTranslationEventBox } from '../../types/beatmap/wrapper/lightTranslationEventBox.ts';

/** Light translation event box group beatmap class object. */
export abstract class WrapLightTranslationEventBoxGroup<
    TGroup extends { [P in keyof TGroup]: TGroup[P] },
    TBox extends { [P in keyof TBox]: TBox[P] },
    TBase extends { [P in keyof TBase]: TBase[P] },
    TFilter extends { [P in keyof TFilter]: TFilter[P] },
> extends WrapEventBoxGroup<TGroup, TBox, TBase, TFilter>
    implements IWrapLightTranslationEventBoxGroup<TGroup, TBox, TBase, TFilter> {
    declare protected _boxes: IWrapLightTranslationEventBox<TBox, TBase, TFilter>[];

    abstract get boxes(): IWrapLightTranslationEventBox<TBox, TBase, TFilter>[];
    abstract set boxes(value: IWrapLightTranslationEventBox<TBox, TBase, TFilter>[]);
}
