import { IIndexFilter } from '../../types/beatmap/v3/indexFilter.ts';
import { ILightColorEvent } from '../../types/beatmap/v3/lightColorEvent.ts';
import { ILightColorEventBox } from '../../types/beatmap/v3/lightColorEventBox.ts';
import { ILightColorEventBoxGroup } from '../../types/beatmap/v3/lightColorEventBoxGroup.ts';
import { IWrapLightColorEventBoxGroupAttribute } from '../../types/beatmap/wrapper/lightColorEventBoxGroup.ts';
import { DeepPartial } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapLightColorEventBoxGroup } from '../wrapper/lightColorEventBoxGroup.ts';
import { LightColorEventBox } from './lightColorEventBox.ts';

/** Light color event box group beatmap v3 class object. */
export class LightColorEventBoxGroup extends WrapLightColorEventBoxGroup<
   ILightColorEventBoxGroup,
   ILightColorEventBox,
   ILightColorEvent,
   IIndexFilter
> {
   static default: Required<ILightColorEventBoxGroup> = {
      b: 0,
      g: 0,
      e: [],
      customData: {},
   };

   constructor();
   constructor(
      data: DeepPartial<
         IWrapLightColorEventBoxGroupAttribute<
            ILightColorEventBoxGroup,
            ILightColorEventBox,
            ILightColorEvent,
            IIndexFilter
         >
      >,
   );
   constructor(data: DeepPartial<ILightColorEventBoxGroup>);
   constructor(
      data:
         & DeepPartial<ILightColorEventBoxGroup>
         & DeepPartial<
            IWrapLightColorEventBoxGroupAttribute<
               ILightColorEventBoxGroup,
               ILightColorEventBox,
               ILightColorEvent,
               IIndexFilter
            >
         >,
   );
   constructor(
      data:
         & DeepPartial<ILightColorEventBoxGroup>
         & DeepPartial<
            IWrapLightColorEventBoxGroupAttribute<
               ILightColorEventBoxGroup,
               ILightColorEventBox,
               ILightColorEvent,
               IIndexFilter
            >
         > = {},
   ) {
      super();

      this._time = data.b ?? data.time ?? LightColorEventBoxGroup.default.b;
      this._id = data.g ?? data.id ?? LightColorEventBoxGroup.default.g;
      this._boxes = (
         (data.e as unknown as ILightColorEventBox[]) ??
            (data.boxes as ILightColorEventBox[]) ??
            LightColorEventBoxGroup.default.e
      ).map((obj) => new LightColorEventBox(obj));
      this._customData = deepCopy(data.customData ?? LightColorEventBoxGroup.default.customData);
   }

   static create(): LightColorEventBoxGroup[];
   static create(
      ...data: DeepPartial<
         IWrapLightColorEventBoxGroupAttribute<
            ILightColorEventBoxGroup,
            ILightColorEventBox,
            ILightColorEvent,
            IIndexFilter
         >
      >[]
   ): LightColorEventBoxGroup[];
   static create(...data: DeepPartial<ILightColorEventBoxGroup>[]): LightColorEventBoxGroup[];
   static create(
      ...data: (
         & DeepPartial<ILightColorEventBoxGroup>
         & DeepPartial<
            IWrapLightColorEventBoxGroupAttribute<
               ILightColorEventBoxGroup,
               ILightColorEventBox,
               ILightColorEvent,
               IIndexFilter
            >
         >
      )[]
   ): LightColorEventBoxGroup[];
   static create(
      ...data: (
         & DeepPartial<ILightColorEventBoxGroup>
         & DeepPartial<
            IWrapLightColorEventBoxGroupAttribute<
               ILightColorEventBoxGroup,
               ILightColorEventBox,
               ILightColorEvent,
               IIndexFilter
            >
         >
      )[]
   ): LightColorEventBoxGroup[] {
      const result: LightColorEventBoxGroup[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   toJSON(): Required<ILightColorEventBoxGroup> {
      return {
         b: this.time,
         g: this.id,
         e: this.boxes.map((e) => e.toJSON()),
         customData: deepCopy(this.customData),
      };
   }

   get boxes(): LightColorEventBox[] {
      return this._boxes as LightColorEventBox[];
   }
   set boxes(value: LightColorEventBox[]) {
      this._boxes = value;
   }

   get customData(): NonNullable<ILightColorEventBoxGroup['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<ILightColorEventBoxGroup['customData']>) {
      this._customData = value;
   }

   isValid(): boolean {
      return this.id >= 0;
   }
}
