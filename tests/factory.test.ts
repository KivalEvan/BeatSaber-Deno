import { array, minLength, minValue, number, pipe, strictObject, string, tuple } from 'valibot';
import {
   createDataCodec,
   createEntityCodec,
   createLoader,
   createSaver,
   createValidator,
} from '../src/factory/mod.ts';
import {
   assertEquals,
   assertThrows,
   clamp,
   type ColorArray,
   colorToHex,
   createBeatmap,
   hexToRgba,
   type IV2Difficulty,
   type IWrapBeatmap,
   setupLogger,
   V2DifficultyContainer,
   V2DifficultySchema,
} from './deps.ts';

Deno.test('data codecs', async (t) => {
   interface EventType {
      effect: 'off' | 'on' | 'flash' | 'fade' | 'transition' | 'trigger' | 'value';
      color?: 'red' | 'blue' | 'white' | null;
      value?: number;
   }
   interface Context {
      type: 'light' | 'trigger' | 'value';
   }

   const codec = createDataCodec<EventType, number, Context>('eventType', {
      encode: (data, context) => {
         switch (context.type) {
            case 'light': {
               if (!data.color || data.effect === 'off') return 0;
               const color = ['blue', 'red', 'white'].indexOf(data.color);
               const effect = ['on', 'flash', 'fade', 'transition'].indexOf(data.effect);
               return 4 * color + (effect + 1);
            }
            case 'trigger': {
               return 0;
            }
            case 'value': {
               if (data.value) return data.value;
               return 0;
            }
         }
      },
      decode: (value, context) => {
         function resolveEventEffect(value: number, type: 'light' | 'trigger' | 'value') {
            switch (type) {
               case 'light': {
                  if (value === 0) return 'off';
                  if (value % 4 === 1) return 'on';
                  if (value % 4 === 2) return 'flash';
                  if (value % 4 === 3) return 'fade';
                  if (value % 4 === 0) return 'transition';
                  return 'off';
               }
               default: {
                  return type;
               }
            }
         }
         function resolveEventColor(value: number) {
            if (value > 8) return 'white';
            if (value > 4) return 'red';
            if (value > 0) return 'blue';
            return null;
         }
         switch (context.type) {
            case 'light': {
               return {
                  effect: resolveEventEffect(value, context.type),
                  color: resolveEventColor(value),
               };
            }
            case 'trigger': {
               return { effect: resolveEventEffect(value, context.type) };
            }
            case 'value': {
               return { effect: resolveEventEffect(value, context.type), value: value };
            }
         }
      },
   });

   await t.step('encode', () => {
      assertEquals(codec().encode({ effect: 'off', color: null }, { type: 'light' }), 0);
      assertEquals(codec().encode({ effect: 'on', color: 'red' }, { type: 'light' }), 5);
      assertEquals(codec().encode({ effect: 'fade', color: 'blue' }, { type: 'light' }), 3);
      assertEquals(codec().encode({ effect: 'trigger' }, { type: 'trigger' }), 0);
      assertEquals(codec().encode({ effect: 'value', value: 2 }, { type: 'value' }), 2);
   });
   await t.step('decode', () => {
      assertEquals(codec().decode(0, { type: 'light' }), { effect: 'off', color: null });
      assertEquals(codec().decode(5, { type: 'light' }), { effect: 'on', color: 'red' });
      assertEquals(codec().decode(3, { type: 'light' }), { effect: 'fade', color: 'blue' });
      assertEquals(codec().decode(0, { type: 'trigger' }), { effect: 'trigger' });
      assertEquals(codec().decode(2, { type: 'value' }), { effect: 'value', value: 2 });
   });
});

Deno.test('entity codecs', async (t) => {
   const codec = createEntityCodec<number, { vanilla: number; extensions: number }>('line-index', {
      getVersion: (index) => {
         if (index >= 1000 || index <= -1000) return 'extensions';
         if ([0, 1, 2, 3].includes(index)) return 'vanilla';
         throw new Error(`Could not resolve version for: ${index}`);
      },
      codecs: {
         'vanilla': {
            encode: (index) => clamp(Math.round(index), 0, 3),
            decode: (index) => index,
         },
         'extensions': {
            encode: (index) => (index < 0 ? index * 1000 - 1000 : index * 1000 + 1000),
            decode: (index) => (index < 0 ? index / 1000 + 1 : index / 1000 - 1),
         },
      },
   });

   await t.step('encode', () => {
      assertEquals(codec('vanilla').encode(1.25, undefined), 1);
      assertEquals(codec('extensions').encode(1.25, undefined), 2250);
   });
   await t.step('decode', () => {
      assertEquals(codec('vanilla').decode(1, undefined), 1);
      assertEquals(codec('extensions').decode(2250, undefined), 1.25);
   });
});

Deno.test('validator', async (t) => {
   setupLogger();

   const codec = createDataCodec('bookmarks', {
      encode: (data: { time: number; name: string; color: string }[]) => {
         return data.map((x) => ({ b: x.time, n: x.name, c: hexToRgba(x.color) }));
      },
      decode: (data: { b: number; n: string; c: ColorArray }[]) => {
         return data.map((x) => ({ time: x.b, name: x.n, color: colorToHex(x.c) }));
      },
   });

   const validate = createValidator(codec(), () => {
      return array(
         strictObject({
            b: pipe(number(), minValue(0)),
            n: pipe(string(), minLength(1)),
            c: tuple([number(), number(), number()]),
         }),
      );
   });

   const invalid = [{ b: -10, n: '', c: [255], x: false }];

   await t.step('throws by default', () => {
      assertThrows(() => validate(invalid, {}));
   });
});

Deno.test('data processors', async (t) => {
   const codec = createEntityCodec('difficulty', {
      codecs: {
         [2]: {
            encode: (data: IWrapBeatmap) => V2DifficultyContainer.serialize(data),
            decode: (data: IV2Difficulty) => V2DifficultyContainer.deserialize(data),
         },
      },
      getVersion: (data) => {
         if (data._version) {
            return Number.parseInt(data._version[0]) as 2;
         }
         throw new Error(`Could not resolve version for: ${data}`);
      },
   });

   const validator = createValidator(codec(2), () => V2DifficultySchema);

   const wrapper = createBeatmap({
      version: 2,
      lightshow: { useNormalEventsAsCompatibleEvents: true },
   });
   const serial: Required<IV2Difficulty> = {
      _version: '2.6.0',
      _notes: [],
      _obstacles: [],
      _events: [],
      _sliders: [],
      _waypoints: [],
      _specialEventsKeywordFilters: { _keywords: [] },
      _customData: {},
   };

   await t.step('load', () => {
      const load = createLoader(codec(2), { validator });
      const actual = load(serial, {});
      assertEquals(actual, wrapper);
   });
   await t.step('save', () => {
      const save = createSaver(codec(2), { validator });
      const actual = save(wrapper, {});
      assertEquals(actual, serial);
   });
});
