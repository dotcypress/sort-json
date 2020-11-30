/**
 * Sorts the keys on objects
 * @param {*} old                           - An object to sort the keys of, if not object just
 *                                            returns whatever was given
 * @param {Object} [sortOptions = {}]           - optional parameters
 * @param [options.reverse = false]         - When sorting keys, converts all keys to lowercase so
 *                                            that capitalization doesn't interfere with sort order
 * @param [options.ignoreCase = false]      - When sorting keys, converts all keys to
 * @param [options.depth = Infinity]        - Depth's level sorting keys on a
 * @param [options.arrayPropName = ""]      - Deep sort arrays by containing objects property
 *                                            multidimensional object
 * @returns {*}                             - Object with sorted keys, if old wasn't an object
 *                                            returns whatever was passed
 */
function visit(old, options) {
  const sortOptions = options || {};

  const ignoreCase = sortOptions.ignoreCase || false;
  const reverse = sortOptions.reverse || false;
  const depth = sortOptions.depth || Infinity;
  const level = sortOptions.level || 1;
  const processing = level <= depth;

  if (typeof (old) !== 'object' || old === null) {
    return old;
  }

  const isArray = Array.isArray(old);
  const copy = isArray ? [] : {};

  let keys = Object.keys(old);
  if (processing) {
    let compare = isArray && sortOptions.arrayPropName
      ? (left, right) => {
        const leftKey = old[left][sortOptions.arrayPropName] || left;
        const rightKey = old[right][sortOptions.arrayPropName] || right;
        return ignoreCase ? leftKey.toLowerCase().localeCompare(rightKey.toLowerCase()) : leftKey.localeCompare(rightKey);
      }
      : ignoreCase ? (left, right) => left.toLowerCase().localeCompare(right.toLowerCase()) : undefined;

    keys.sort(compare);
  }

  if (reverse) {
    keys = keys.reverse();
  }

  keys.forEach((key, idx) => {
    const subSortOptions = Object.assign({}, sortOptions);
    subSortOptions.level = level + 1;
    copy[isArray ? idx : key] = visit(old[key], subSortOptions);
  });

  return copy;
}

module.exports = visit;
