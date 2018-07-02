import { createImageData } from './create-image-data'

export function invert(pixels) {
    const output = createImageData(pixels.width, pixels.height);
    const d = pixels.data;
    const od = output.data;
    for (var i = 0; i < d.length; i += 4) {
        od[i] = 255 - d[i];
        od[i + 1] = 255 - d[i + 1];
        od[i + 2] = 255 - d[i + 2];
        od[i + 3] = d[i + 3];
    }
    return output;
}