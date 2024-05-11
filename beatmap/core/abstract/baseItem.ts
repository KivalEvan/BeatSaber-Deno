import type { IWrapBaseItem } from '../../../types/beatmap/wrapper/baseItem.ts';
import { Cloneable } from '../../shared/cloneable.ts';

/** Basic building block of beatmap object. */
export abstract class BaseItem extends Cloneable implements IWrapBaseItem {
   customData: IWrapBaseItem['customData'] = {};

   setCustomData(value: this['customData']): this {
      this.customData = value;
      return this;
   }
   resetCustomData(): this {
      this.customData = {};
      return this;
   }
   removeCustomData(key: string | string[]): this {
      if (typeof key === 'string') {
         delete this.customData[key];
      } else {
         key.forEach((k) => delete this.customData[k]);
      }
      return this;
   }
   addCustomData(object: this['customData']): this {
      for (const k in object) {
         this.customData[k] = object[k];
      }
      return this;
   }

   sort(_fn?: ((a: this, b: this) => number) | undefined): this {
      return this;
   }

   func(fn: (object: this) => void): this {
      fn(this);
      return this;
   }

   abstract isValid(): boolean;

   isChroma(): boolean {
      return false;
   }

   isNoodleExtensions(): boolean {
      return false;
   }

   isMappingExtensions(): boolean {
      return false;
   }
}
