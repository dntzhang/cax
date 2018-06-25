import To from './to'
import './animate'
import TWEEN from './tween'

To.easing = {
    linear: TWEEN.Easing.Linear.None
};

['Quadratic',
    'Cubic',
    'Quartic',
    'Quintic',
    'Sinusoidal',
    'Exponential',
    'Circular',
    'Elastic',
    'Back',
    'Bounce'].forEach(item => {
        const itemLower = item.toLowerCase()
        To.easing[itemLower + 'In'] = TWEEN.Easing[item].In
        To.easing[itemLower + 'Out'] = TWEEN.Easing[item].Out
        To.easing[itemLower + 'InOut'] = TWEEN.Easing[item].InOut
    })


module.exports = To