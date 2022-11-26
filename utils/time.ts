export function toMmss(seconds: number): string {
    if (!seconds) {
        return '0:00';
    }
    const numr = Math.floor(seconds);
    const temp = numr / 60;
    const min = temp < 0 ? `-${Math.ceil(temp).toString()}` : Math.floor(temp).toString();
    const sec = Math.abs(numr % 60)
        .toString()
        .padStart(2, '0');
    return `${min}:${sec}`;
}

export function toHhmmss(minutes: number): string {
    if (!minutes) {
        return '0:00:00';
    }
    const sec = Math.round((minutes * 60) % 60)
        .toString()
        .padStart(2, '0');
    return `${toMmss(minutes)}:${sec}`;
}

export function toMmssms(seconds: number): string {
    if (!seconds) {
        return '0:00.000';
    }
    const dec = (seconds % 1).toString().split('.')[1]?.padEnd(3, '0').slice(0, 3) || '000';
    return `${toMmss(seconds)}.${dec}`;
}

export function mmssToFloat(mmss: string): number {
    const [m, s] = mmss.split(':').map((el) => parseInt(el));
    return m * 60 + s;
}
