
import { invert } from './invert'
import { blur } from './blur'

export function filter(pixels, name) {

    if (name.indexOf('invert(') === 0) {
        return invert(pixels, Number(name.replace('invert(', '').replace('%)', '')) / 100)
    }else if(name.indexOf('blur(') === 0){
        return blur(pixels, Number(name.replace('blur(', '').replace('px)', '')))
    }
}

