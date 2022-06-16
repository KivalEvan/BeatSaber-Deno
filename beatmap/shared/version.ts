import { Version } from '../../types/beatmap/shared/version.ts';

export function compareVersion(version: Version, compareTo: Version) {
    const ver = getVersionArray(version);
    const verCompare = getVersionArray(compareTo);
    for (const num in ver) {
        if (ver[num] < verCompare[num]) {
            return 'old';
        }
        if (ver[num] > verCompare[num]) {
            return 'new';
        }
    }
    return 'current';
}

const getVersionArray = (version: Version): number[] => {
    return version
        .replace('v', '')
        .split('.')
        .map((el) => parseInt(el));
};
