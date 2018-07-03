
import { invert } from './invert'

export function filter(pixels, name) {

    if (name.indexOf('invert(') === 0) {
        return invert(pixels, Number(name.replace('invert(', '').replace('%)', '')) / 100)
    }
}

