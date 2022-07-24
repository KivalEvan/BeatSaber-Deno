import { IChromaComponent, IChromaEnvironment } from '../../../types/beatmap/v3/chroma.ts';
import { IChromaEnvironment as IChromaEnvironmentV2 } from '../../../types/beatmap/v2/chroma.ts';
import { Vector3 } from '../../../types/beatmap/shared/heck.ts';
import logger from '../../../logger.ts';

const tag = (name: string) => {
    return `[chroma::environment::${name}]`;
};

export function envV2toV3(env: IChromaEnvironmentV2[]): IChromaEnvironment[] {
    return env.map((e) => {
        let components: IChromaComponent = {};
        if (e._lightID) components = { ILightWithId: { lightID: e._lightID } };
        if (e._id && e._lookupMethod) {
            return {
                id: e._id,
                lookupMethod: e._lookupMethod,
                track: e._track,
                duplicate: e._duplicate,
                active: e._active,
                scale: e._scale,
                position: e._position?.map((n) => n * 0.6) as Vector3,
                rotation: e._rotation,
                localPosition: e._localPosition?.map((n) => n * 0.6) as Vector3,
                localRotation: e._localRotation,
                components,
            };
        }
        if (e._geometry) {
            if (e._lightID && components.ILightWithId) {
                components.ILightWithId.type = 0;
            }
            return {
                geometry: {
                    type: e._geometry._type,
                    material: typeof e._geometry._material === 'string' ? e._geometry._material : {
                        shader: e._geometry._material._shader,
                        shaderKeywords: e._geometry._material._shaderKeywords,
                        environmentMaterial: e._geometry._material._environmentMaterial,
                        collision: e._geometry._material._collision,
                        track: e._geometry._material._track,
                        color: e._geometry._material._color,
                    },
                    collision: e._geometry._collision,
                },
                track: e._track,
                duplicate: e._duplicate,
                active: e._active,
                scale: e._scale,
                position: e._position?.map((n) => n * 0.6) as Vector3,
                rotation: e._rotation,
                localPosition: e._localPosition?.map((n) => n * 0.6) as Vector3,
                localRotation: e._localRotation,
                components,
            };
        }
        throw new Error('Error converting environment v2 to v3');
    });
}

export function envV3toV2(env: IChromaEnvironment[]): IChromaEnvironmentV2[] {
    return env.map((e) => {
        if (e.id && e.lookupMethod) {
            return {
                _id: e.id,
                _lookupMethod: e.lookupMethod,
                _track: e.track,
                _duplicate: e.duplicate,
                _active: e.active,
                _scale: e.scale,
                _position: e.position?.map((n) => n / 0.6) as Vector3,
                _rotation: e.rotation,
                _localPosition: e.localPosition?.map((n) => n / 0.6) as Vector3,
                _localRotation: e.localRotation,
                _lightID: e.components?.ILightWithId?.lightID,
            };
        }
        if (e.geometry) {
            if (e.components?.ILightWithId?.type || e.components?.ILightWithId?.lightID) {
                logger.warn(tag('V3toV2'), 'v2 geometry cannot be made assignable light to specific type');
            }
            return {
                _geometry: {
                    _type: e.geometry.type,
                    _material: typeof e.geometry.material === 'string' ? e.geometry.material : {
                        _shader: e.geometry.material.shader,
                        _shaderKeywords: e.geometry.material.shaderKeywords,
                        _environmentMaterial: e.geometry.material.environmentMaterial,
                        _collision: e.geometry.material.collision,
                        _track: e.geometry.material.track,
                        _color: e.geometry.material.color,
                    },
                    _collision: e.geometry.collision,
                },
                _track: e.track,
                _duplicate: e.duplicate,
                _active: e.active,
                _scale: e.scale,
                _position: e.position?.map((n) => n / 0.6) as Vector3,
                _rotation: e.rotation,
                _localPosition: e.localPosition?.map((n) => n / 0.6) as Vector3,
                _localRotation: e.localRotation,
                _lightID: e.components?.ILightWithId?.lightID,
            };
        }
        throw new Error('Error converting environment v3 to v2');
    });
}

export function unityUnitToNoodleUnit(env: IChromaEnvironmentV2[]): void {
    env.forEach((e) => {
        e._position = e._position?.map((n) => n / 0.6) as Vector3;
        e._localPosition = e._localPosition?.map((n) => n / 0.6) as Vector3;
    });
}
