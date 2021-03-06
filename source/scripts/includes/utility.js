/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * clamp(x * 255, 0, 255)
 *
 * @param {Number} value The lower boundary of the output range
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * clamp(x * 255, 0, 255)
 *
 * @param {Number} value The lower boundary of the output range
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
export function onetime(node, type, callback) {
    node.addEventListener(type, function handler(e) {
        e.target.removeEventListener(e.type, handler)
        return callback(e)
    });
}


/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * clamp(x * 255, 0, 255)
 *
 * @param {Number} value The lower boundary of the output range
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
export function transitionOnceWithClass(element, className) {
    element.classList.add(className)
    onetime(element, 'transitionend', function () {
        element.classList.remove(className)
    })
}