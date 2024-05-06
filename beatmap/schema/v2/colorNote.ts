import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { INote } from '../../../types/beatmap/v2/note.ts';
import type { IWrapColorNoteAttribute } from '../../../types/beatmap/wrapper/colorNote.ts';
import { deepCopy } from '../../../utils/misc.ts';

export const colorNote: ISchemaContainer<IWrapColorNoteAttribute, INote> = {
   defaultValue: {
      _time: 0,
      _lineIndex: 0,
      _lineLayer: 0,
      _type: 0,
      _cutDirection: 0,
      _customData: {},
   } as Required<INote>,
   serialize(data: IWrapColorNoteAttribute): INote {
      return {
         _time: data.time,
         _type: data.color,
         _lineIndex: data.posX,
         _lineLayer: data.posY,
         _cutDirection: data.direction,
         _customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<INote> = {}): Partial<IWrapColorNoteAttribute> {
      return {
         time: data._time ?? this.defaultValue._time,
         posX: data._lineIndex ?? this.defaultValue._lineIndex,
         posY: data._lineLayer ?? this.defaultValue._lineLayer,
         color: (data._type ?? this.defaultValue._type) as 0,
         direction: data._cutDirection ?? this.defaultValue._cutDirection,
         customData: deepCopy(
            data._customData ?? this.defaultValue._customData,
         ),
      };
   },
   isValid(data: IWrapColorNoteAttribute) {
      return true;
   },
   isChroma(data: IWrapColorNoteAttribute): boolean {
      return (
         Array.isArray(data.customData._color) ||
         typeof data.customData._disableSpawnEffect === 'boolean'
      );
   },
   isNoodleExtensions(data: IWrapColorNoteAttribute): boolean {
      return (
         Array.isArray(data.customData._animation) ||
         typeof data.customData._cutDirection === 'number' ||
         typeof data.customData._disableNoteGravity === 'boolean' ||
         typeof data.customData._disableNoteLook === 'boolean' ||
         typeof data.customData._fake === 'boolean' ||
         Array.isArray(data.customData._flip) ||
         typeof data.customData._interactable === 'boolean' ||
         Array.isArray(data.customData._localRotation) ||
         typeof data.customData._noteJumpMovementSpeed === 'number' ||
         typeof data.customData._noteJumpStartBeatOffset === 'number' ||
         Array.isArray(data.customData._position) ||
         Array.isArray(data.customData._rotation)
      );
   },
   isMappingExtensions(data: IWrapColorNoteAttribute) {
      return false;
   },
};