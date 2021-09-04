// Chroma Colour Shift
// hue: [any range] => shift by color wheel (0 -> red, 120 -> green, 240 -> blue, 360 -> red, ...)
// saturation: [0-inf] => saturation percentage
// value: [any range] => add value
// alpha: [any range] => add alpha
// fixed value: [>0 to enable] => set value instead of add
// fixed alpha: [>0 to enable] => set alpha instead of add

// modified version of https://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
function normalize(x, min, max) {
    return (x - min) / (max - min);
}
function lerp(x, y, a) {
    return x + (y - x) * a;
}
function RGBAtoHSVA(r, g, b, a = 1) {
    let max, min, d, h, s, v;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    d = max - min;
    s = max === 0 ? 0 : d / max;
    v = max;

    switch (max) {
        case min:
            h = 0;
            break;
        case r:
            h = g - b + d * (g < b ? 6 : 0);
            h /= 6 * d;
            break;
        case g:
            h = b - r + d * 2;
            h /= 6 * d;
            break;
        case b:
            h = r - g + d * 4;
            h /= 6 * d;
            break;
    }
    return [h, s, v, a];
}
function HSVAtoRGBA(hue, saturation, value, alpha) {
    let r, g, b, i, f, p, q, t;
    i = Math.floor(hue * 6);
    f = hue * 6 - i;
    p = value * (1 - saturation);
    q = value * (1 - f * saturation);
    t = value * (1 - (1 - f) * saturation);
    switch (i % 6) {
        case 0:
            (r = value), (g = t), (b = p);
            break;
        case 1:
            (r = q), (g = value), (b = p);
            break;
        case 2:
            (r = p), (g = value), (b = t);
            break;
        case 3:
            (r = p), (g = q), (b = value);
            break;
        case 4:
            (r = t), (g = p), (b = value);
            break;
        case 5:
            (r = value), (g = p), (b = q);
            break;
    }
    return [r, g, b, alpha];
}
function interpolateColor(hsvaStart, hsvaEnd, norm) {
    return HSVAtoRGBA(
        ...RGBAtoHSVA(...hsvaStart).map((hsva, i) => lerp(hsva, hsvaEnd[i], norm))
    );
}
function shiftColor(currentColor, shiftHSVA) {
    return RGBAtoHSVA(...currentColor).map((hsva, i) => {
        if (i === 1) {
            return Math.min(Math.max(0, hsva * shiftHSVA[i]), 1);
        }
        return hsva + shiftHSVA[i];
    });
}

function shift(
    cursor,
    notes,
    events,
    walls,
    _,
    global,
    data,
    customEvents,
    bpmChanges
) {
    const hsvaShift = [
        global.params[0] >= 0
            ? (global.params[0] / 360) % 1
            : (((global.params[0] % 360) + 360) / 360) % 1,
        global.params[1] / 100,
        global.params[2],
        global.params[3],
    ];
    const objectSelected = []
        .concat(
            notes.filter((n) => n.selected),
            events.filter((ev) => ev.selected),
            walls.filter((w) => w.selected)
        )
        .sort((a, b) => a._time - b._time);
    if (!objectSelected.length) {
        alert('Select any notes, events, or walls with Chroma color');
        return;
    }
    const startTime = objectSelected[0]._time;
    const endTime = objectSelected[objectSelected.length - 1]._time;

    objectSelected.forEach((obj) => {
        const norm = normalize(obj._time, startTime, endTime);
        if (obj._customData && obj._customData._color) {
            obj._customData._color = interpolateColor(
                obj._customData._color,
                shiftColor(obj._customData._color, hsvaShift),
                norm
            );
        }
        if (obj._customData && obj._customData._lightGradient) {
            obj._customData._lightGradient._startColor = interpolateColor(
                obj._customData._lightGradient._startColor,
                shiftColor(obj._lightGradient._startColor, hsvaShift),
                norm
            );
            obj._customData._lightGradient._endColor = interpolateColor(
                obj._customData._lightGradient._endColor,
                shiftColor(obj._lightGradient._endColor, hsvaShift),
                norm
            );
        }
    });
}

module.exports = {
    name: 'Colour Shift Gradient',
    params: {
        hue: 0,
        saturation: 100,
        value: 0,
        alpha: 0,
    },
    run: shift,
};
