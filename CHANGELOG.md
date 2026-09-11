# Changelog

## 3.0.1 [2026-09-11]

```diff
* Fixed lightshow conversion rejecting lighting from v1/v2 difficulties as an unsupported source version (#15 by @officialMECH)
```

## 3.0.0 [2026-09-06]

Read the [migration guidance](./GUIDE.md#migration) before you upgrade.

```diff
+ Added focused imports for types, utilities, and versioned schemas, so applications can import only the features they use.
+ Added the Hip Hop Mixtape 2 environment, color scheme, and event track metadata from Beat Saber 1.45.0
# Core classes moved to `@kvl/bsmap/extensions/core` (`bsmap/extensions/core` on NPM) (breaking)
  Root class exports and the `beatmap/core` subpath are removed.
# Custom filesystem and path shims require `rename`, `renameSync`, `unlink`, `unlinkSync`, `dirname`, and `join` (breaking)
  Their interfaces are available from the `shims` subpath.
# Environment tables and lookup helpers moved to `@kvl/bsmap/environment` (`bsmap/environment` on NPM) (breaking)
# File reads transfer custom-data ownership by default (breaking)
  Objects can share mutable custom data. Use `load.customDataOwnership: 'copy'` for independent copies.
  Direct loads and deserializers still copy by default.
# Loading and saving reject malformed or unsupported versions, invalid JSON roots, and invalid indexed references (breaking)
  File writes also reject `NaN` and infinite numbers.
# `retrieveVersion` returns the raw value as `unknown`, or `undefined` when no version key exists (breaking)
  An own `_version` key takes precedence over `version`, even when its value is nullish.
* Corrected v2/v3 to v4 conversion when EARLY and LATE rotation events occur at the same beat
* File writes replace the destination atomically where the filesystem supports it, instead of
  exposing partially written JSON. File metadata can change, and crash durability is not guaranteed.
  Separate module instances or execution contexts can still conflict during concurrent writes.
* Fixed Deno file removal deleting empty directories. It now rejects directories and requires both
  read and write permissions.
* Fixed ignored validation and compatibility options, including category-specific `throwOn` options
  for nested schema errors.
* Fixed inconsistent v2 note order between saves
* Fixed options being ignored when callers supply `null` or `undefined` as the version argument
* Fixed the logger returning `undefined` before setup
* Improved beatmap processing speed and reduced memory allocations
* Improved serializer and deserializer map types with generic contracts that preserve version-specific
  inputs, outputs, and options. Runtime behavior is unchanged.
* Reduced NPM package size and improved support for tree-shaking
- Schema containers and `ISchemaContainer` are removed (breaking)
  Schema modules expose standalone `serialize*` and `deserialize*` functions, with separate maps for each direction.
- The `formatNumber` utility is removed (breaking)
  Use `Intl.NumberFormat` for number formatting.
```

## 2.3.6 [2026-06-28]

```diff
+ Added Metallica variant color scheme
* Optimised object deduplication remapping
```

## 2.3.5 [2026-06-12]

```diff
+ Added color scheme variant from 1.44
* Added missing entry for environment filter and light ID (#14 by @officialMECH)
```

## 2.3.4 [2026-05-01]

```diff
+ Added Prodigy environment
+ Added other color scheme variant
* Fixed Heck related type definition (#13 by @Swifter1243)
```

## 2.3.3 [2026-03-28]

```diff
* Improved track definition format (#11 by @officialMECH)
* Backport-free obstacles to legacy format (#12 by @officialMECH)
```

## 2.3.2 [2026-01-10]

```diff
+ Added count to GLS track definition
+ Added kind to event track definition
- Removed couple of basic event helper
  - Since basic event is not equal in every environment, they serve inaccurate result and is now entirely removed
  - Use `TrackDefinitions` to obtain more information from basic event
```

## 2.3.1 [2026-01-10]

```diff
+ Simple GLS track definition
* Fix lint and thus package manager publishing
```

## 2.3.0 [2025-12-31]

This version introduce setup to improve compatibility and bundle size reduction. If you have made
use of `logger`, you must now include `setupLogger(new Logger())` on entrypoint or not at all if you
prefer no log and use `getLogger()` to use current logger. You may also use third-party or build-in
logging provided you wrap around Logger.

File restructured to be more streamlined and coupled to existing context. Most `types` has been
moved to their respective location. For end-user, if you have made use of `types` you may only
require to do minimal change.

```diff
+ Added Spoooky, Cube, Coldplay environment and color scheme
+ Added chain link wrapper
+ Added bezier helpers
+ Added couple of vector helpers
* Significant internal change to improve tree-shaking (#9 by @officialMECH)
* Increased default rounding from 4 to 8
* Updated color scheme
* File and type restructured (#9 by @officialMECH)
* Simplified change log
* Several bug fixes and tweaks (#9, #10 by @officialMECH)
- Removed unnecessary vector helpers
```

## 2.2.9 [2025-08-20]

```diff
* [Swing] removed stray log
```

## 2.2.8 [2025-08-02]

```diff
* [Swing] incorrectly calculates slider speed and next swing detection
```

## 2.2.7 [2025-08-02]

```diff
* [Swing] now only output real-time value
* [Placement] properly handle modded params
* [Swing] incorrectly calculate SPS progression drop
```

## 2.2.6 [2025-07-09]

```diff
- No longer serialise v4 spawn rotation
```

## 2.2.5 [2025-07-07]

```diff
+ Regex split mappers field in v2 serialisation (#6 by @officialMECH)
+ Event renamer for older environment (#6 by @officialMECH)
* Point definition should accurately represent modern format
* Pre-v3 obstacle preserve ME `_type` (#6 by @officialMECH)
* Missing exports (#6 by @officialMECH)
* Correct event name mapping (#6 by @officialMECH)
* Fix validation error for ME pre-v3 obstacle
* Renamed `offsetRotation` to correct `offsetWorldRotation`
```

## 2.2.4 [2025-04-30]

```diff
* Ok, for real this time
```

## 2.2.3 [2025-04-30]

```diff
* Implicit version not working
```

## 2.2.2 [2025-04-24]

```diff
+ Additional NJS helper method
* Fixed DNT dependency hopefully again
* Fixed Vivify CreateCamera interface
* Fixed several other type issue
```

## 2.2.1 [2025-04-09]

```diff
* Faster `deepCopy` for array
* Dependency mapping error for standard schema
```

## 2.2.0 [2025-03-29]

```diff
+ Vivify support
* Schema validation overhaul (#3 by @officialMECH)
* Decouple wrapper functionality into their own (#5 by @officialMECH)
* ⚠️ BREAKING: IO functionality now returns wrapper object instead of concrete class (#5 by @officialMECH)
- Removed wrapper implementation interface boilerplate
  - Removed attribute suffix to replace the removal
```

## 2.1.9 [2024-12-21]

```diff
* Metallica variant color scheme fix
```

## 2.1.8 [2024-12-21]

```diff
+ Metallica environment & color schema
+ Info 4.0.1
  +  Color scheme override note and light
+ Beatmap 4.1.0
  +  NJS change event
* Color scheme use override now separated to two type: Note and Light
* Certain schema type not being exported
```

## 2.1.7 [2024-11-14]

```diff
+ Monstercat 2.0 environment & color scheme
+ `getBpmAtTime` and `toRealTimeAtOffset` TimeProcessor method
- Deprecated Beatmap v4 `spawnRotation`, now uses object lane attribute `r`
- Deprecated `adjustTime` TimeProcessor method
- Removed `isLonger` in obstacle (BPM change can cause issue)
```

## 2.1.6 [2024-10-13]

```diff
* Fixed conversion from v4 always including 0 rotation value event
```

## 2.1.5 [2024-10-12]

```diff
* Info color scheme should no longer include white color if not present
* Stats note count did not count
```

## 2.1.4 [2024-10-08]

```diff
+ Britney Spears environment & color scheme
+ Official editor bookmarks
+ `setVersion` to versioned beatmap file class
* Split `GenericFilename` type to 4 types: `Info`, `AudioData`, `Beatmap` and `Lightshow`
```

## 2.1.3 [2024-09-09]

```diff
* Indexing error when optimising v3
```

## 2.1.2 [2024-08-31]

```diff
* Fixed shims for real this time
```

## 2.1.1 [2024-08-31]

```diff
* Certain function return generic whenever possible
* Shims should no longer error when bundling for browser
```

## 2.1.0 [2024-08-10]

```diff
+ Static method `createOne` for beatmap core
  + As opposed to `create`, this returns instance instead of array of instance.
+ Add new difficulty name serial
+ Several JSDocs written
* Moved source files to `src`
* Separate exports for `utils` and `types` to entrypoint
* Renamed function in `time` utils for clarification
* Renamed data check to schema declaration
* Updated color scheme
* Implicitly use beatmap version for conversion function
* Allow beatmap conversion on save/write
* `globals` reduced to only global beatmap directory
* Loading beatmap with explicit version did not convert version if mismatched
* v2 to v3 conversion accidentally removed bomb notes
* Several undocumented fixes
* Typod from `hass` to `has`
- Removed `web` functions from `utils`
- Removed `easing` params from certain function with `alpha` value
```

## 2.0.2 [2024-07-23]

```diff
* Default exports not being exported
* Missing many exports
```

## 2.0.1 [2024-07-23]

```diff
* NPM entrypoint fix, surely
```

## 2.0.0 [2024-07-23]

```diff
+ Collider environment & color scheme
+ `read` and `write` module
  +  This is to separate loading and saving functionality from including `fs`
+ `Beatmap` class object
  + Contains both `Difficulty` and `Lightshow`, separating respective object to supposed category
  + Loading and saving will now use `Beatmap` object rather than individual class above
  + `customData` under `Beatmap` will be placed onto but not replacing existing `customData` object in `Difficulty` and `Lightshow` upon save
+ Compatibility check on save
+ Several beatmap helpers
+ Gaussian random using Box-Muller transform utils function
* Complete overhaul on beatmap structure
  * Now version agnostic, no need to create from version-specific object
  * This follows much closer to how beatmap is processed in-game than what it is in format
  * Customizable and arbitrary version format
    * For simplicity sake, only counts major version, but not limited to single digit
  * Implicit Mapping Extensions conversion
    * Mapping extensions is not recommended to be used as it is highly dependent on map format and the module tries its best to interpret Mapping Extensions as close to plugin beatmap processing
* `BeatPerMinute` class renamed to `TimeProcessor`
- Several leftover/dead code that could lead to confusion
- Default value and deep copy omitted when deserialize
  - This will instead be done inside `core` beatmap
```
