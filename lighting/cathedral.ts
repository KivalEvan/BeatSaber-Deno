// holy shit image are so tedious to work with and optimise
import * as bsmap from '../deno/mod.ts';

console.log('Running script...');
console.time('Runtime');
bsmap.logger.setLevel(bsmap.logger.logLevels.VERBOSE);
bsmap.globals.path =
    'D:/SteamLibrary/steamapps/common/Beat Saber/Beat Saber_Data/CustomWIPLevels/Cathedral/';
const INPUT_FILE = 'Lightshow.dat';
const OUTPUT_FILE = INPUT_FILE;

const difficulty = await bsmap.load.difficulty(INPUT_FILE);

difficulty._version = '2.5.0';
difficulty._customData = difficulty._customData ?? {};
difficulty._customData._environment = [];
difficulty._customData._time = difficulty._customData._time ?? 0;
difficulty._customData._time++;
difficulty._events = [];
const _environment = difficulty._customData._environment;
const _events = difficulty._events;

//#region environment declaration stuff
// regex for environment enhancement
const regexCube = '\\[\\d+\\]PillarPair.\\[\\d+\\]PillarL.\\[\\d+\\]Pillar$';
const regexDoor = '\\[\\d+\\]MagicDoorSprite$';
const regexRingRight = '\\[\\d+\\]PillarTrackLaneRingsR$';
const regexRingLeft = '\\[\\d+\\]PillarTrackLaneRingsR.?\\(1\\)$';
const regexSideLaser = '\\[42\\]SideLaser$';
const regexGlowLine = '\\[\\d+\\]GlowLineL$';
const regexPillarL = '\\[\\d+\\]PillarPair\\.\\[\\d+\\]PillarL$';
const regexPillarR = '\\[\\d+\\]PillarPair\\.\\[\\d+\\]PillarR$';
const regexSmallPillarL = '\\[\\d+\\]SmallPillarPair\\.\\[\\d+\\]PillarL$';
const regexSmallPillarR = '\\[\\d+\\]SmallPillarPair\\.\\[\\d+\\]PillarR$';
const regexCloudGeometry = '\\[\\d+\\]HighCloudsGenerator.\\[\\d+\\]OpaqueGeometry$';

_events.push(
    { _time: 0, _type: 0, _value: 1, _floatValue: 1 },
    { _time: 0, _type: 1, _value: 5, _floatValue: 1 },
    { _time: 0, _type: 2, _value: 1, _floatValue: 1 },
    { _time: 0, _type: 3, _value: 1, _floatValue: 1 },
    { _time: 0, _type: 4, _value: 5, _floatValue: 1 },
    { _time: 8, _type: 8, _value: 0, _floatValue: 1 },
    { _time: 16, _type: 8, _value: 0, _floatValue: 1 },
    { _time: 24, _type: 9, _value: 0, _floatValue: 1 },
    { _time: 32, _type: 9, _value: 0, _floatValue: 1 }
);

for (let i = 0; i < 12; i++) {
    _environment.push({
        _id: regexCloudGeometry,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [0, 16, -128 + i * 24],
        _rotation: [i % 2 ? 270 : 90, 0, 0],
        _scale: [
            0.125 + 0.5 * Math.cos(bsmap.utils.degToRad(i * 8)),
            0.25 + Math.random() * 0.5,
            0.125 + 0.5 * Math.cos(bsmap.utils.degToRad(i * 8)),
        ],
    });
}

_environment.push(
    {
        _id: regexCloudGeometry,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [0, -8, 0],
        _rotation: [0, 0, 0],
        _scale: [0.75, 0.75, 0.75],
    },
    {
        _id: regexRingRight,
        _lookupMethod: 'Regex',
        _position: [-96, 0, 128],
        _scale: [1, 1, 1],
    },
    {
        _id: regexRingLeft,
        _lookupMethod: 'Regex',
        _position: [96, 0, 128],
        _scale: [1, 1, 1],
    },
    {
        _id: regexRingRight,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [10, -6, 128],
        _rotation: [0, 180, 45],
        _scale: [0.25, 0.25, 1],
    },
    {
        _id: regexRingLeft,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-10, -6, 128],
        _rotation: [0, 180, 45],
        _scale: [0.25, 0.25, 1],
    },
    {
        _id: regexRingRight,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [48, 6, 144],
        _rotation: [0, 180, 45],
        _scale: [0.25, 0.25, 1],
    },
    {
        _id: regexRingLeft,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-48, 6, 144],
        _rotation: [0, 180, 45],
        _scale: [0.25, 0.25, 1],
    },
    {
        _id: regexRingRight,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [64, 20, 160],
        _rotation: [0, 180, 45],
        _scale: [0.25, 0.25, 1],
    },
    {
        _id: regexRingLeft,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-64, 20, 160],
        _rotation: [0, 180, 45],
        _scale: [0.25, 0.25, 1],
    }
);

//#region cringe pillar
for (let i = 0; i < 5; i++) {
    _environment.push(
        {
            _id: i
                ? regexPillarL.replace('PillarPair', `PillarPair \\(${i}\\)`)
                : regexPillarL,
            _lookupMethod: 'Regex',
            _rotation: [45, 315, 210 - i * 7.5],
            _position: [-30, 12, 76 + i * 8],
        },
        {
            _id: i
                ? regexPillarR.replace('PillarPair', `PillarPair \\(${i}\\)`)
                : regexPillarR,
            _lookupMethod: 'Regex',
            _rotation: [45, 45, 150 + i * 7.5],
            _position: [30, 12, 76 + i * 8],
        },
        {
            _id: i
                ? regexSmallPillarL.replace('PillarPair', `PillarPair \\(${i}\\)`)
                : regexSmallPillarL,
            _lookupMethod: 'Regex',
            _rotation: [135, 165, -7.5],
            _position: [-24, 28 - i * 2, 74 + i * 8],
        },
        {
            _id: i
                ? regexSmallPillarR.replace('PillarPair', `PillarPair \\(${i}\\)`)
                : regexSmallPillarR,
            _lookupMethod: 'Regex',
            _rotation: [135, 195, 7.5],
            _position: [24, 28 - i * 2, 74 + i * 8],
        }
    );
}
//#endregion

for (let i = 0; i < 9; i++) {
    const posX = 12;
    const posY = 0;
    const posZ = i * 8 + 16;
    _environment.push(
        {
            _id: regexSideLaser,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [posX, posY, posZ],
            _rotation: [4 + i * 2, 0, 7.5],
        },
        {
            _id: regexSideLaser,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [-posX, posY, posZ],
            _rotation: [4 + i * 2, 0, -7.5],
        }
    );
}

//#region everything else
_environment.push(
    {
        _id: regexDoor,
        _lookupMethod: 'Regex',
        _position: [-26.5, 20, 112],
        _scale: [0.1875, 0.5, 1],
        _rotation: [0, 0, 0],
    },
    {
        _id: regexDoor,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-21.5, 20, 112],
        _scale: [0.1875, 0.5, 1],
        _rotation: [0, 0, 0],
    },
    {
        _id: regexDoor,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [21.5, 20, 112],
        _scale: [0.1875, 0.5, 1],
        _rotation: [0, 0, 0],
    },
    {
        _id: regexDoor,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [26.5, 20, 112],
        _scale: [0.1875, 0.5, 1],
        _rotation: [0, 0, 0],
    },
    {
        _id: regexGlowLine,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-4.28125, -0.0625, -512],
        _rotation: [90, 0, 0],
        _scale: [1.5, 1.5, 1.5],
    },
    {
        _id: regexGlowLine,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [4.28125, -0.0625, -512],
        _rotation: [90, 0, 0],
        _scale: [1.5, 1.5, 1.5],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-5.375, 30.5, 112],
        _scale: [0.25, 0.02075, 0.25],
        _rotation: [0, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [5.375, 30.5, 112],
        _scale: [0.25, 0.02075, 0.25],
        _rotation: [0, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-1.375, 30.5, 112],
        _scale: [0.25, 0.0175, 0.25],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [1.375, 30.5, 112],
        _scale: [0.25, 0.0175, 0.25],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-2.675, 30.5, 112],
        _scale: [0.6875, 0.0075, 0.25],
        _rotation: [0, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [2.675, 30.5, 112],
        _scale: [0.6875, 0.0075, 0.25],
        _rotation: [0, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-2.675, 28, 112],
        _scale: [0.6875, 0.0075, 0.25],
        _rotation: [0, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [2.675, 28, 112],
        _scale: [0.6875, 0.0075, 0.25],
        _rotation: [0, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-1.375, 27, 112],
        _scale: [0.25, 0.0625, 0.25],
        _rotation: [0, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [1.375, 27, 112],
        _scale: [0.25, 0.0625, 0.25],
        _rotation: [0, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [0, 34.5, 112],
        _scale: [0.725, 0.0075, 0.25],
        _rotation: [0, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [0, 16, 112],
        _scale: [0.725, 0.0075, 0.25],
        _rotation: [0, 0, 0],
    },
    {
        _id: regexSideLaser,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-10, 40, 0],
        _scale: [1, 1, 1],
        _rotation: [90, 0, 0],
    },
    {
        _id: regexSideLaser,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-4, 48, 0],
        _scale: [1, 1, 1],
        _rotation: [90, 0, 0],
    },
    {
        _id: regexSideLaser,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [4, 48, 0],
        _scale: [1, 1, 1],
        _rotation: [90, 0, 0],
    },
    {
        _id: regexSideLaser,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [10, 40, 0],
        _scale: [1, 1, 1],
        _rotation: [90, 0, 0],
    },
    {
        _id: regexGlowLine,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-26, 10, -512],
        _scale: [1.5, 1.5, 1.5],
        _rotation: [90, 0, 0],
    },
    {
        _id: regexGlowLine,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-27.5, 8, -512],
        _scale: [1.5, 1.5, 1.5],
        _rotation: [90, 0, 0],
    },
    {
        _id: regexGlowLine,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [26, 10, -512],
        _scale: [1.5, 1.5, 1.5],
        _rotation: [90, 0, 0],
    },
    {
        _id: regexGlowLine,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [27.5, 8, -512],
        _scale: [1.5, 1.5, 1.5],
        _rotation: [90, 0, 0],
    }
);
//#endregion

//#region za base
_environment.push(
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-18.2, 0, 48],
        _scale: [4.75, 0.00075, 22],
        _rotation: [0, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [18.2, 0, 48],
        _scale: [4.75, 0.00075, 22],
        _rotation: [0, 0, 0],
    }
);
//#endregion

//#region za wall
_environment.push(
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-32, 4, 16 - (1 / 3) * 32],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [32, 4, 16 - (1 / 3) * 32],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-32, 4, 16 - (2 / 3) * 32],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [32, 4, 16 - (2 / 3) * 32],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-32, 4, 48 - (1 / 3) * 32],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [32, 4, 48 - (1 / 3) * 32],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-32, 4, 48 - (2 / 3) * 32],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [32, 4, 48 - (2 / 3) * 32],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-32, 4, 80 - (1 / 3) * 32],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [32, 4, 80 - (1 / 3) * 32],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-32, 4, 80 - (2 / 3) * 32],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [32, 4, 80 - (2 / 3) * 32],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-32, 4, 112 - (1 / 3) * 32],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [32, 4, 112 - (1 / 3) * 32],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-32, 4, 112 - (2 / 3) * 32],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [32, 4, 112 - (2 / 3) * 32],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [16 - (3 / 4) * 32, 4, -16],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [16 - (1 / 4) * 32, 4, -16],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-32, 0, 48],
        _scale: [0.125, 0.005, 22],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [32, 0, 48],
        _scale: [0.125, 0.005, 22],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-32, 3.625, 48],
        _scale: [0.125, 0.005, 22],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [32, 3.625, 48],
        _scale: [0.125, 0.005, 22],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-32, 27.375, 48],
        _scale: [0.125, 0.0025, 22],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [32, 27.375, 48],
        _scale: [0.125, 0.0025, 22],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-32, 31.5, 48],
        _scale: [0.125, 0.005, 22],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [32, 31.5, 48],
        _scale: [0.125, 0.005, 22],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [0, 27.375, -16],
        _scale: [11, 0.0025, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [0, 31.5, -16],
        _scale: [11, 0.005, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-16, 0, 48],
        _scale: [0.125, 0.0005, 22],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [16, 0, 48],
        _scale: [0.125, 0.0005, 22],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-17.8125, 3.625, -16],
        _scale: [4.375, 0.005, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [17.8125, 3.625, -16],
        _scale: [4.375, 0.005, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-17.8125, 0, -16],
        _scale: [4.375, 0.005, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [17.8125, 0, -16],
        _scale: [4.375, 0.005, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-4.7, 0, -16],
        _scale: [0.125, 0.075, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [4.7, 0, -16],
        _scale: [0.125, 0.075, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-4.7, 13.9375, -16],
        _scale: [0.125, 0.02, 0.125],
        _rotation: [180, 0, 30],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [4.7, 13.9375, -16],
        _scale: [0.125, 0.02, 0.125],
        _rotation: [180, 0, 330],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-3, 17, -16],
        _scale: [0.125, 0.01975, 0.125],
        _rotation: [180, 0, 60],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [3, 17, -16],
        _scale: [0.125, 0.01975, 0.125],
        _rotation: [180, 0, 300],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-17.8125, 3.625, 112],
        _scale: [4.375, 0.005, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [17.8125, 3.625, 112],
        _scale: [4.375, 0.005, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-17.8125, 0, 112],
        _scale: [4.375, 0.005, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [17.8125, 0, 112],
        _scale: [4.375, 0.005, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-4.7, 0, 112],
        _scale: [0.125, 0.0375, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [4.7, 0, 112],
        _scale: [0.125, 0.0375, 0.125],
        _rotation: [180, 0, 0],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-3, 6, 112],
        _scale: [0.125, 0.075, 0.125],
        _rotation: [180, 0, 300],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [3, 6, 112],
        _scale: [0.125, 0.075, 0.125],
        _rotation: [180, 0, 60],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [-3, 5.875, 112],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 330],
    },
    {
        _id: regexCube,
        _lookupMethod: 'Regex',
        _duplicate: 1,
        _position: [3, 5.875, 112],
        _scale: [0.125, 0.125, 0.125],
        _rotation: [180, 0, 30],
    }
);
//#endregion

const createPillar = (x: number, z: number) => {
    for (let i = 0; i < 4; i++) {
        const rotationAmount = 180 / 4;
        _environment.push({
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [x, 0.75, z],
            _scale: [0.75, 0.0175, 0.3105],
            _rotation: [180, i * rotationAmount, 0],
        });
    }
    for (let i = 0; i < 4; i++) {
        const rotationAmount = 180 / 4;
        _environment.push(
            {
                _id: regexCube,
                _lookupMethod: 'Regex',
                _duplicate: 1,
                _position: [x, 0, z],
                _scale: [0.84375, 0.005, 0.3493125],
                _rotation: [180, rotationAmount / 2 + i * rotationAmount, 0],
            },
            {
                _id: regexCube,
                _lookupMethod: 'Regex',
                _duplicate: 1,
                _position: [x, 3.625, z],
                _scale: [0.84375, 0.005, 0.3493125],
                _rotation: [180, rotationAmount / 2 + i * rotationAmount, 0],
            },
            {
                _id: regexCube,
                _lookupMethod: 'Regex',
                _duplicate: 1,
                _position: [x, 3, z],
                _scale: [0.75, 0.005, 0.3105],
                _rotation: [180, rotationAmount / 2 + i * rotationAmount, 0],
            }
        );
    }
    for (let i = 0; i < 8; i++) {
        const rotationAmount = 180 / 8;
        _environment.push({
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [x, 4, z],
            _scale: [0.6, 0.125, 0.4],
            _rotation: [180, i * rotationAmount, 0],
        });
    }
    for (let i = 0; i < 4; i++) {
        const rotationAmount = 180 / 4;
        _environment.push({
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [x, 27.375, z],
            _scale: [0.75, 0.0025, 0.3105],
            _rotation: [180, rotationAmount / 2 + i * rotationAmount, 0],
        });
    }
    for (let i = 0; i < 8; i++) {
        const rotationAmount = 180 / 4;
        _environment.push({
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [x, 27.8125, z],
            _scale: [0.25, 0.015, 0.625],
            _rotation: [165, i * rotationAmount, 0],
        });
    }
    for (let i = 0; i < 4; i++) {
        const rotationAmount = 180 / 4;
        _environment.push({
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [x, 30, z],
            _scale: [0.75, 0.01, 0.3105],
            _rotation: [180, i * rotationAmount, 0],
        });
    }
    for (let i = 0; i < 4; i++) {
        const rotationAmount = 180 / 4;
        _environment.push({
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [x, 31.5, z],
            _scale: [0.84375, 0.005, 0.3493125],
            _rotation: [180, i * rotationAmount, 0],
        });
    }
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            let xShift!: number;
            let zShift!: number;
            if (i === 0) {
                xShift = 0;
                zShift = -1;
            }
            if (i === 1) {
                xShift = -1;
                zShift = 0;
            }
            if (i === 2) {
                xShift = 0;
                zShift = 1;
            }
            if (i === 3) {
                xShift = 1;
                zShift = 0;
            }
            const rotationAmount = 360 / 4;
            _environment.push({
                _id: regexCube,
                _lookupMethod: 'Regex',
                _duplicate: 1,
                _position: [
                    x +
                        Math.sin(bsmap.utils.degToRad(90 + 160 - j * 12)) *
                            37.5 *
                            xShift +
                        xShift * 36.125,
                    15 + Math.sin(bsmap.utils.degToRad(160 - j * 12)) * 50,
                    z +
                        Math.sin(bsmap.utils.degToRad(90 + 160 - j * 12)) *
                            37.5 *
                            zShift +
                        zShift * 36.125,
                ],
                _scale: [0.3125, 0.0575, 0.3125],
                _rotation: [160 - j * 12, i * rotationAmount, 0],
            });
        }
    }
};
const createChair = (x: number, z: number) => {
    _environment.push(
        {
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [0 + x, 0.75, 0 + z],
            _scale: [0.75, 0.0005, 0.15625],
            _rotation: [180, 0, 0],
        },
        {
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [0 + x, 1, -0.4375 + z],
            _scale: [0.75, 0.00375, 0.015625],
            _rotation: [165, 0, 0],
        },
        {
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [-2.125 + x, 0, -0.375 + z],
            _scale: [0.015625, 0.004, 0.015625],
            _rotation: [180, 0, 0],
        },
        {
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [-2.125 + x, 0, 0.375 + z],
            _scale: [0.015625, 0.004, 0.015625],
            _rotation: [180, 0, 0],
        },
        {
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [0 + x, 0, -0.375 + z],
            _scale: [0.015625, 0.004, 0.015625],
            _rotation: [180, 0, 0],
        },
        {
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [0 + x, 0, 0.375 + z],
            _scale: [0.015625, 0.004, 0.015625],
            _rotation: [180, 0, 0],
        },
        {
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [2.125 + x, 0, -0.375 + z],
            _scale: [0.015625, 0.004, 0.015625],
            _rotation: [180, 0, 0],
        },
        {
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [2.125 + x, 0, 0.375 + z],
            _scale: [0.015625, 0.004, 0.015625],
            _rotation: [180, 0, 0],
        },
        {
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [-2.125 + x, 0.75, -0.4375 + z],
            _scale: [0.015625, 0.006, 0.015625],
            _rotation: [168, 0, 0],
        },
        {
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [0 + x, 0.75, -0.4375 + z],
            _scale: [0.015625, 0.0055, 0.015625],
            _rotation: [168, 0, 0],
        },
        {
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [2.125 + x, 0.75, -0.4375 + z],
            _scale: [0.015625, 0.006, 0.015625],
            _rotation: [168, 0, 0],
        },
        {
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [-2.125 + x, 0.75, 0.25 + z],
            _scale: [0.015625, 0.003, 0.015625],
            _rotation: [168, 0, 0],
        },
        {
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [2.125 + x, 0.75, 0.25 + z],
            _scale: [0.015625, 0.003, 0.015625],
            _rotation: [168, 0, 0],
        },
        {
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [-2.125 + x, 1.28125, 0.1875 + z],
            _scale: [0.015625, 0.00375, 0.015625],
            _rotation: [90, 0, 0],
        },
        {
            _id: regexCube,
            _lookupMethod: 'Regex',
            _duplicate: 1,
            _position: [2.125 + x, 1.28125, 0.1875 + z],
            _scale: [0.015625, 0.00375, 0.015625],
            _rotation: [90, 0, 0],
        }
    );
};

createPillar(16, -16);
createPillar(-16, -16);
createPillar(16, 16);
createPillar(-16, 16);
createPillar(16, 48);
createPillar(-16, 48);
createPillar(16, 80);
createPillar(-16, 80);
createPillar(16, 112);
createPillar(-16, 112);
createPillar(32, -16);
createPillar(-32, -16);
createPillar(32, 16);
createPillar(-32, 16);
createPillar(32, 48);
createPillar(-32, 48);
createPillar(32, 80);
createPillar(-32, 80);
createPillar(32, 112);
createPillar(-32, 112);

for (let z = 0; z < 16; z++) {
    createChair(-11, 2 + z * 4);
    createChair(-6.5, 2 + z * 4);
    createChair(6.5, 2 + z * 4);
    createChair(11, 2 + z * 4);
}
//#endregion

await bsmap.save.difficulty(difficulty, {
    filePath: OUTPUT_FILE,
    optimise: { enabled: true, floatTrim: 4 },
});
console.timeEnd('Runtime');
console.log(_environment.length, 'environment enhancements');
console.log(_events.length, 'events');
// const info = bsmap.load.infoSync();
// const BPM = bsmap.bpm.create(info._beatsPerMinute);
console.log('Map saved');