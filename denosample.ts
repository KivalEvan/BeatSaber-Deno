import * as bsmap from 'https://raw.githubusercontent.com/KivalEvan/BeatSaber-MappingScript/main/deno/mod.ts';
import { dirname } from 'https://deno.land/std@0.122.0/path/mod.ts';

// working directory is not necessary unless you're working on importing anything from workspace and different workspace with different folder path
bsmap.settings.workingDirectory =
    dirname(Deno.mainModule).replace('file:///', '') + '/'; // for some reason deno doesnt like to deal with file:///
bsmap.settings.mapDirectory =
    'D:/SteamLibrary/steamapps/common/Beat Saber/Beat Saber_Data/CustomWIPLevels/testmap/';

const info = bsmap.load.infoSync('Info.dat');
const difficulty = bsmap.load.difficultySync('ExpertPlusStandard.dat');

info._previewDuration = 14;
info._difficultyBeatmapSets.forEach((set) =>
    console.log(set._beatmapCharacteristicName, set._difficultyBeatmaps.length)
);

const BPM = bsmap.bpm.create(info._beatsPerMinute);
const NJS = bsmap.njs.create(BPM, 16);
NJS.offset = 0;

console.log(BPM.toRealTime(42));
console.log(BPM.toBeatTime(6.9));
console.log(NJS.calcHalfJumpDuration(), NJS.calcHalfJumpDuration(0.5));

difficulty._events.push({
    _time: 1,
    _type: 1,
    _value: 1,
    _floatValue: 1,
});

bsmap.save.infoSync('Info.dat', info);
await bsmap.save.difficulty('ExpertPlusStandard.dat', difficulty);
